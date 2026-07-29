import { PluginContext, TaskPaymentProvider } from "@liquio/plugin-sdk";
import {
  ApiErrorResponseException,
  ApiException,
  ApiResponseRetrievalException,
  CheckoutApiClient,
  CheckoutResponse,
  CommerceCaseApiClient,
  CommunicatorConfiguration,
  CreateCommerceCaseRequest,
  GetCheckoutsQuery,
  OrderManagementCheckoutActionsApiClient,
  OrderType,
  StatusCheckout,
} from "pcp-server-nodejs-sdk";

import {
  PayoneCalculatedPaymentData,
  PayoneOptions,
  PayoneResolvedPaymentData,
  PayoneStatusInfo,
} from "./types";

/**
 * PAYONE Commerce Platform payment provider for `components/task`.
 *
 * v1 scope is redirect/hosted-checkout only (see plan §5.4/§8.2) - card tokenization requires
 * client-side tokenizer work in `cabinet-front` and is explicitly out of scope here.
 */
export class PayoneProvider extends TaskPaymentProvider<PayoneOptions> {
  private readonly commerceCaseClient: CommerceCaseApiClient;
  private readonly checkoutClient: CheckoutApiClient;
  // Added for task 11's cancelOrder (needed for OrderManagementCheckoutActionsApiClient.cancelOrder -
  // see that method below for why this particular client, rather than
  // PaymentExecutionApiClient.cancelPayment, was chosen).
  private readonly orderManagementClient: OrderManagementCheckoutActionsApiClient;

  constructor(context: PluginContext, options: PayoneOptions) {
    super(context, options);
    const config = new CommunicatorConfiguration(
      options.apiKey,
      options.apiSecret,
      options.baseUrl,
    );
    this.commerceCaseClient = new CommerceCaseApiClient(config);
    this.checkoutClient = new CheckoutApiClient(config);
    this.orderManagementClient = new OrderManagementCheckoutActionsApiClient(
      config,
    );
  }

  /**
   * Create a PAYONE commerce case with an inline, auto-executed checkout and return the URL to
   * redirect the customer to in order to complete payment on PAYONE's hosted page.
   *
   * `data` is expected to already be resolved (amount/description/orderId/etc. evaluated
   * against the document by `components/task`'s `document.ts#resolvePaymentAmount` before this
   * method is ever called) - this plugin has no access to, and must not depend on,
   * `components/task`'s internal `Sandbox`/JSON-schema formula machinery.
   */
  async calculatePayment(data: unknown): Promise<PayoneCalculatedPaymentData> {
    const payload = data as PayoneResolvedPaymentData;

    if (
      typeof payload?.amount !== "number" ||
      !Number.isFinite(payload.amount)
    ) {
      throw new Error(
        `PayoneProvider.calculatePayment: resolved payment data is missing a numeric "amount" (got ${JSON.stringify(payload?.amount)}).`,
      );
    }
    if (!payload.orderId) {
      throw new Error(
        'PayoneProvider.calculatePayment: resolved payment data is missing "orderId".',
      );
    }

    // `payload.amount` is a plain decimal currency amount (e.g. 100.5 for "100.50"), NOT cents -
    // PAYONE's AmountOfMoney.amount is an integer number of cents, so it must be converted.
    const amountInCents = Math.round(payload.amount * 100);
    const currencyCode = payload.currency ?? this.options.defaultCurrency;
    // Append documentId/paymentControlPath as query params so they round-trip back on the
    // customer's browser redirect (RedirectionData.returnUrl's own JSDoc: "You can add any
    // number of key value pairs in the query string... that help you identify the customer when
    // they return"). This is what lets handleStatus (task 10) identify which document/control a
    // later callback is about - without it, handleStatus has nothing to key off.
    const returnUrl = this.buildReturnUrl(
      payload.returnUrl ?? this.options.defaultRedirectUrl,
      {
        documentId: payload.documentId,
        paymentControlPath: payload.paymentControlPath,
      },
    );

    const request: CreateCommerceCaseRequest = {
      merchantReference: payload.orderId,
      checkout: {
        amountOfMoney: {
          amount: amountInCents,
          currencyCode,
        },
        autoExecuteOrder: true,
        orderRequest: {
          orderType: OrderType.Full,
          paymentMethodSpecificInput: {
            redirectPaymentMethodSpecificInput: {
              paymentProductId: this.options.paymentProductId,
              redirectionData: {
                returnUrl,
              },
            },
          },
        },
      },
    };

    try {
      const response = await this.commerceCaseClient.createCommerceCaseRequest(
        this.options.merchantId,
        request,
      );
      const redirectUrl =
        response.checkout?.paymentResponse?.merchantAction?.redirectData
          ?.redirectURL;

      if (!redirectUrl) {
        throw new Error(
          `PayoneProvider.calculatePayment: PAYONE response did not contain a redirect URL (commerceCaseId=${response.commerceCaseId ?? "unknown"}).`,
        );
      }

      return {
        redirectUrl,
        commerceCaseId: response.commerceCaseId,
        checkoutId: response.checkout?.checkoutId,
        paymentExecutionId:
          response.checkout?.paymentResponse?.paymentExecutionId,
        orderId: payload.orderId,
        amount: payload.amount,
        currency: currencyCode,
      };
    } catch (error) {
      throw this.translateSdkError(error);
    }
  }

  /**
   * Append identifying query params (e.g. documentId/paymentControlPath) onto a return URL,
   * preserving any query params already present. Silently skips params whose value is missing.
   */
  private buildReturnUrl(
    baseUrl: string,
    params: Record<string, string | undefined>,
  ): string {
    const url = new URL(baseUrl);
    for (const [key, value] of Object.entries(params)) {
      if (value) url.searchParams.set(key, value);
    }
    return url.toString();
  }

  /**
   * Translate a raw PAYONE SDK exception into a clear, loggable `Error` instead of letting an
   * opaque SDK exception escape uninterpreted.
   */
  private translateSdkError(error: unknown): Error {
    if (error instanceof ApiErrorResponseException) {
      const apiErrors = error.getErrors();
      return new Error(
        `PayoneProvider: PAYONE API returned an error response (status ${error.getStatusCode()}): ${JSON.stringify(apiErrors)}`,
      );
    }
    if (error instanceof ApiResponseRetrievalException) {
      return new Error(
        `PayoneProvider: failed to retrieve/parse the PAYONE API response (status ${error.getStatusCode()}): ${error.getResponseBody()}`,
      );
    }
    if (error instanceof ApiException) {
      return new Error(
        `PayoneProvider: PAYONE API call failed (status ${error.getStatusCode()}): ${error.getResponseBody()}`,
      );
    }
    return error instanceof Error
      ? error
      : new Error(
          `PayoneProvider: unexpected error calling PAYONE API: ${String(error)}`,
        );
  }

  // --- Remaining TaskPaymentProvider abstract methods -----------------------------------------
  // Intentionally NOT implemented in this task (core config + calculatePayment only). These are
  // temporary stubs so the class is fully concrete and the package builds; replaced by tasks
  // 10 (handleStatus) and 11 (cancelOrder/checkStatus/the rest).

  /**
   * Handle both the customer's browser being redirected back from PAYONE's hosted checkout page
   * (`GET /payment/:customer/:status`) and any async server-to-server webhook PAYONE might send
   * (`POST /payment/:customer/:status`, `POST /payment/:customer`) - both hit this same method
   * (`components/task/src/controllers/payment.ts#handleStatus` ->
   * `businesses/document.ts#handlePaymentStatus`).
   *
   * KNOWN UNKNOWN (see plan/task doc for full detail): PAYONE's exact webhook/redirect-callback
   * payload schema and signing mechanism could not be confirmed - `docs.commerce.payone.com`'s
   * webhook reference is a JS-rendered SPA that only ever yields the landing page to both an
   * automated fetch and a web search, never the actual payload schema (verified again while
   * implementing this method, not just during planning). A webhook doc page was found at
   * `developer.payone.com/en/integration/api-developer-guide/webhooks` describing a
   * `payment.id`/HMAC-signed payload, but that surface has no `commerceCaseId`/`checkoutId`
   * concepts at all, so it cannot be confirmed to describe *this* SDK's Commerce Platform
   * (checkout/commerce-case based) webhooks rather than PAYONE's separate legacy Server API -
   * it is NOT relied upon below.
   *
   * DEFENSIVE DESIGN used instead (deliberate, not an oversight): never trust the incoming
   * callback payload's status field - treat the callback as "something changed, go check" and
   * re-query PAYONE's own API (`CheckoutApiClient.getCheckoutRequest`) for authoritative status.
   * This is standard webhook-security practice anyway and sidesteps needing the exact payload
   * schema. It does NOT remove the need to identify *which* checkout the callback is about, so
   * multiple plausible key names are checked defensively in both the payload and the query
   * params, pending real PAYONE sandbox testing to confirm/narrow this (no sandbox account is
   * confirmed to exist yet).
   */
  async handleStatus(
    data: unknown,
    _providerOptions: unknown,
    _status: string,
    queryParamsObject: unknown,
    _headersObject: unknown,
    checkPrevTransaction?: boolean,
  ): Promise<PayoneStatusInfo> {
    const parsedData = this.parseCallbackData(data);
    const params = this.asRecord(queryParamsObject);

    const commerceCaseId = this.pickField(parsedData, params, [
      "commerceCaseId",
      "commerce_case_id",
      "commerceCaseID",
    ]);
    const checkoutId = this.pickField(parsedData, params, [
      "checkoutId",
      "checkout_id",
      "checkoutID",
      "hostedCheckoutId",
    ]);

    if (!commerceCaseId || !checkoutId) {
      throw new Error(
        `PayoneProvider.handleStatus: could not identify which PAYONE commerce case/checkout this callback is about ` +
          `(looked for commerceCaseId/checkoutId under those and a few alternate key names in both the callback payload ` +
          `and the query params; found commerceCaseId=${JSON.stringify(commerceCaseId)}, checkoutId=${JSON.stringify(checkoutId)}). ` +
          `payloadKeys=${JSON.stringify(Object.keys(parsedData))}, queryParamKeys=${JSON.stringify(Object.keys(params))}`,
      );
    }

    const documentId = this.pickField(parsedData, params, [
      "documentId",
      "document_id",
    ]);
    const paymentControlPath = this.pickField(parsedData, params, [
      "paymentControlPath",
      "payment_control_path",
    ]);

    if (!documentId || !paymentControlPath) {
      throw new Error(
        `PayoneProvider.handleStatus: could not identify which document/paymentControlPath this callback belongs to ` +
          `(documentId=${JSON.stringify(documentId)}, paymentControlPath=${JSON.stringify(paymentControlPath)}). ` +
          `These must round-trip back via the query string on the "returnUrl" passed to calculatePayment (or be present ` +
          `on the webhook body) - confirm this once real PAYONE sandbox testing is possible.`,
      );
    }

    let checkout: CheckoutResponse;
    try {
      checkout = await this.checkoutClient.getCheckoutRequest(
        this.options.merchantId,
        commerceCaseId,
        checkoutId,
      );
    } catch (error) {
      throw this.translateSdkError(error);
    }

    // --- Status mapping table (explicit, not implicit branching) --------------------------------
    // Source: `StatusCheckout` enum, `pcp-server-nodejs-sdk/dist/models/StatusCheckout.d.ts`
    // (real values read directly from the installed SDK, not invented). Note:
    // `ExtendedCheckoutStatus` (mentioned in the task doc as a possible second signal) is exported
    // by the SDK but is NOT actually a field of `CheckoutResponse` (confirmed by reading
    // `CheckoutResponse.d.ts` - it only has `checkoutStatus: StatusCheckout`), so it cannot be
    // read off this response and is not used here.
    //   OPEN                -> false (checkout still awaiting completion)
    //   PENDING_COMPLETION  -> false (payment in progress, not yet finalized)
    //   COMPLETED           -> true  (order executed successfully)
    //   BILLED              -> true  (funds collected - a strictly further-along success state)
    //   CHARGEBACKED        -> false (funds clawed back after the fact - no longer a success)
    //   DELETED             -> false (checkout was cancelled/removed before completion)
    const successStatuses: ReadonlySet<StatusCheckout> = new Set([
      StatusCheckout.COMPLETED,
      StatusCheckout.BILLED,
    ]);
    const isSuccess = Boolean(
      checkout.checkoutStatus && successStatuses.has(checkout.checkoutStatus),
    );

    // `checkPrevTransaction` (per `document.ts`'s only caller of this path with it set) is used to
    // check whether an already-`calculatePayment`'d checkout has *already* reached a terminal
    // status before creating a brand new PAYONE checkout for the same document - i.e. duplicate/
    // re-entry protection, not duplicate-webhook-delivery protection. Since this method always
    // re-queries PAYONE's API (an idempotent GET) rather than mutating anything, there is no
    // extra "don't reprocess" branching needed here for correctness - the caller
    // (`document.ts#calculatePayment`) itself already decides what to do based on the returned
    // `status.isSuccess` (skip creating a new checkout when true). `checkPrevTransaction` is kept
    // as a parameter (matching the abstract signature) and is safe to ignore for the re-query
    // itself, but is threaded into `extraData` below so it's visible in the persisted history for
    // audit purposes.
    const transactionId =
      this.pickField(parsedData, params, [
        "transactionId",
        "paymentExecutionId",
        "payment_execution_id",
      ]) ??
      checkout.paymentExecutions?.[0]?.paymentExecutionId ??
      checkoutId;

    return {
      documentId,
      paymentControlPath,
      transactionId,
      status: { isSuccess },
      extraData: {
        order_id: checkout.references?.merchantReference,
        commerceCaseId,
        checkoutId,
        checkoutStatus: checkout.checkoutStatus,
        paymentStatus: checkout.statusOutput?.paymentStatus,
        checkPrevTransaction: Boolean(checkPrevTransaction),
      },
    };
  }

  /** Best-effort parse of the raw callback payload into a plain key/value record. */
  private parseCallbackData(data: unknown): Record<string, unknown> {
    if (typeof data === "string") {
      if (!data.trim()) return {};
      try {
        return this.asRecord(JSON.parse(data));
      } catch {
        return {};
      }
    }
    return this.asRecord(data);
  }

  private asRecord(value: unknown): Record<string, unknown> {
    return value && typeof value === "object"
      ? (value as Record<string, unknown>)
      : {};
  }

  /** Look up the first present, non-empty value for any of `keys`, checking `data` before `params`. */
  private pickField(
    data: Record<string, unknown>,
    params: Record<string, unknown>,
    keys: string[],
  ): string | undefined {
    for (const source of [data, params]) {
      for (const key of keys) {
        const value = source[key];
        if (typeof value === "string" && value.length > 0) return value;
      }
    }
    return undefined;
  }

  /**
   * NOT SUPPORTED (deliberate, permanent decision - task 11's bounded check of PAYONE's SDK
   * surface, `docs.payone.com/pcp/commerce-platform-api`, and the 8 endpoint clients under
   * `pcp-server-nodejs-sdk/dist/endpoints/` found no SMS-confirmation concept anywhere). This
   * matches the plan (§5.2)'s own high-confidence note: v1 uses PAYONE's hosted redirect
   * checkout (see `calculatePayment`'s `redirectPaymentMethodSpecificInput`) - the customer
   * completes/authenticates the payment entirely on PAYONE's own hosted page (including any
   * 3-D Secure/OTP step PAYONE itself needs), so `components/task` never sees, and PAYONE never
   * asks this backend for, a merchant-relayed SMS code.
   */
  async confirmBySmsCode(
    _providerOptions: unknown,
    _calculatedData: unknown,
    _smsCode: string,
  ): Promise<never> {
    throw new Error(
      "confirmBySmsCode is not supported by the Payone provider (Payone uses a hosted redirect checkout with no SMS confirmation step).",
    );
  }

  /**
   * Cancel (reverse) a PAYONE order.
   *
   * Chosen SDK method: `OrderManagementCheckoutActionsApiClient.cancelOrder` (NOT
   * `PaymentExecutionApiClient.cancelPayment`). Both exist and both ultimately reverse a
   * payment, but `OrderManagementCheckoutActionsApiClient.cancelOrder`'s request/response
   * (`CancelRequest`/`CancelResponse`, read from `pcp-server-nodejs-sdk/dist/models/`) is
   * explicitly checkout/order-scoped - its own JSDoc is "mark items as of the respective
   * Checkout as cancelled and to automatically reverse the associated payment", and omitting
   * `cancelItems` cancels the whole ShoppingCart - i.e. exactly "cancel the order" as this
   * method's name says. `PaymentExecutionApiClient.cancelPayment` is payment-execution-scoped
   * (keyed by `paymentExecutionId`, not the checkout as a whole) and reads more like a
   * "cancelPayment" primitive than the order-level operation this method is named for.
   *
   * ID mapping (task's `orderId`/`transactionId`/`sessionId` are NOT PAYONE's own IDs - see the
   * task doc's own framing of this problem):
   * - `sessionId` is treated as PAYONE's `checkoutId` (consistent with `checkStatus` below,
   *   which makes the same choice for its own `sessionId` parameter - the hosted "payment
   *   session" *is* the PAYONE checkout in this v1, redirect-only integration).
   * - PAYONE's `cancelOrder` also needs `commerceCaseId`, which none of `orderId`/
   *   `transactionId`/`sessionId` carry directly (this plugin has no persistence of its own -
   *   see the class-level doc comment - and there is no confirmed round-trip of `commerceCaseId`
   *   through `task`'s own storage back into these three call-site parameters). Rather than
   *   guessing, it is looked up from PAYONE itself: `CheckoutApiClient.getCheckoutsRequest`
   *   filtered by `checkoutId` returns the matching `CheckoutResponse`, whose own
   *   `commerceCaseId` field (confirmed present on `CheckoutResponse.d.ts`) is the value PAYONE
   *   needs.
   * - `orderId` (the merchant-facing order id / `merchantReference`) and `transactionId` (a
   *   `task`-internal, base64-encoded id per `Provider.generateTransactionId` - not a PAYONE id
   *   at all) are not needed to identify the PAYONE resources being cancelled, but are still
   *   threaded into the returned result for correlation/audit logging.
   */
  async cancelOrder(
    _providerOptions: unknown,
    orderId: string,
    transactionId: string,
    sessionId: string,
  ): Promise<unknown> {
    if (!sessionId) {
      throw new Error(
        `PayoneProvider.cancelOrder: missing "sessionId" (expected to be PAYONE's checkoutId) - cannot identify which PAYONE checkout to cancel (orderId=${JSON.stringify(orderId)}, transactionId=${JSON.stringify(transactionId)}).`,
      );
    }

    try {
      const checkoutsResponse = await this.checkoutClient.getCheckoutsRequest(
        this.options.merchantId,
        new GetCheckoutsQuery().setCheckoutId(sessionId),
      );
      const checkout = checkoutsResponse.checkouts?.[0];
      const commerceCaseId = checkout?.commerceCaseId;

      if (!commerceCaseId) {
        throw new Error(
          `PayoneProvider.cancelOrder: could not resolve a PAYONE commerceCaseId for checkoutId=${JSON.stringify(sessionId)} ` +
            `(found ${checkoutsResponse.checkouts?.length ?? 0} matching checkout(s)).`,
        );
      }

      const cancelResponse = await this.orderManagementClient.cancelOrder(
        this.options.merchantId,
        commerceCaseId,
        sessionId,
      );

      return {
        orderId,
        transactionId,
        sessionId,
        commerceCaseId,
        checkoutId: sessionId,
        cancelResponse,
      };
    } catch (error) {
      throw this.translateSdkError(error);
    }
  }

  /**
   * NOT SUPPORTED (deliberate, permanent decision). Task 11's bounded check specifically
   * inspected `PaymentExecutionApiClient.pausePayment`/`refreshPayment` (the two candidates
   * flagged by the task doc as most likely to map to "unhold") by reading their request/response
   * models directly: `PausePaymentRequest` is an empty object and `PausePaymentResponse` only
   * carries a `status` - `pausePayment`'s own description is "Request to pause a payment", i.e.
   * the *opposite* direction of what "unhold" means here (per `document.ts#unholdPayment`'s only
   * caller: releasing a previously *held* payment so it can be collected, right before a document
   * is finalized). `refreshPayment` merely re-fetches/refreshes payment status - it does not
   * change any hold state either. Neither is a "release the hold" operation.
   *
   * The SDK method that actually matches "release a hold so funds get collected" is
   * `PaymentExecutionApiClient.capturePayment` (`CapturePaymentRequest`'s own JSDoc: "capture...
   * the amount that was authorized"). But this plugin's `calculatePayment` always sets
   * `autoExecuteOrder: true` on the order it creates (see that method above, not modified by this
   * task) - PAYONE auto-executes/captures the order as soon as the checkout completes, so there
   * is no separate authorize-then-hold step in this v1 integration for `capturePayment` to ever
   * apply to. Supporting a genuine hold/capture flow would require redoing `calculatePayment` to
   * stop auto-executing, which is out of this task's scope (v1 is redirect/hosted-checkout only,
   * per the class-level doc comment referencing plan §5.4/§8.2).
   */
  async unHoldOrder(_data: unknown): Promise<never> {
    throw new Error(
      "unHoldOrder is not supported by the Payone provider (calculatePayment always creates an auto-executed order - Payone captures funds immediately on checkout completion, so there is no separate authorization hold to release in this v1 integration).",
    );
  }

  /**
   * Check the current status of a PAYONE checkout.
   *
   * ID mapping (mirrors `cancelOrder`'s reasoning above for consistency): `sessionId` is treated
   * as PAYONE's `checkoutId` and `invoiceId` as PAYONE's `commerceCaseId` - the two IDs
   * `CheckoutApiClient.getCheckoutRequest` needs alongside `merchantId`. There is no other
   * confirmed caller of this method in `components/task` today (see task doc's own note: this
   * path is currently unreachable since no provider existed before this plugin) to derive a
   * stricter mapping from, so this is documented as the deliberate interpretation for this
   * provider rather than a universal contract.
   */
  async checkStatus(
    _providerOptions: unknown,
    sessionId: string,
    invoiceId: string,
  ): Promise<unknown> {
    if (!sessionId || !invoiceId) {
      throw new Error(
        `PayoneProvider.checkStatus: missing "sessionId"/"invoiceId" (expected to be PAYONE's checkoutId/commerceCaseId respectively) - ` +
          `got sessionId=${JSON.stringify(sessionId)}, invoiceId=${JSON.stringify(invoiceId)}.`,
      );
    }

    try {
      const checkout: CheckoutResponse =
        await this.checkoutClient.getCheckoutRequest(
          this.options.merchantId,
          invoiceId,
          sessionId,
        );

      // Same success-status table as `handleStatus` above (kept as an independent, small,
      // duplicated const rather than a shared helper, so this task does not have to touch
      // `handleStatus` itself per its own scope constraints).
      const successStatuses: ReadonlySet<StatusCheckout> = new Set([
        StatusCheckout.COMPLETED,
        StatusCheckout.BILLED,
      ]);
      const isSuccess = Boolean(
        checkout.checkoutStatus && successStatuses.has(checkout.checkoutStatus),
      );

      return {
        isSuccess,
        commerceCaseId: invoiceId,
        checkoutId: sessionId,
        checkoutStatus: checkout.checkoutStatus,
        paymentStatus: checkout.statusOutput?.paymentStatus,
        orderId: checkout.references?.merchantReference,
      };
    } catch (error) {
      throw this.translateSdkError(error);
    }
  }

  /**
   * NOT SUPPORTED (deliberate, permanent decision). Task 11's bounded check found no
   * receipt/invoice-document endpoint anywhere among PAYONE's 8 endpoint clients
   * (`AuthenticationApiClient`, `BaseApiClient`, `CheckoutApiClient`, `CommerceCaseApiClient`,
   * `OrderManagementCheckoutActionsApiClient`, `PaymentExecutionApiClient`,
   * `PaymentInformationApiClient`, `PaymentIntentApiClient`) nor in
   * `docs.payone.com/pcp/commerce-platform-api` - PAYONE's Commerce Platform API returns
   * structured checkout/payment status data (`CheckoutResponse`/`PaymentExecution`/etc.), not a
   * merchant-facing receipt document. Any receipt shown to the payer is PAYONE's own hosted-page
   * concern; any receipt `task` itself needs to produce would have to be generated from the
   * structured data already returned by `calculatePayment`/`handleStatus`/`checkStatus` above,
   * not fetched from PAYONE as a distinct "receipt" resource.
   */
  async getPaymentReceiptInfo(_args: {
    paymentSystemParams: unknown;
    orderId: string;
  }): Promise<never> {
    throw new Error(
      "getPaymentReceiptInfo is not supported by the Payone provider (Payone's Commerce Platform API has no receipt/invoice-document endpoint - see checkStatus/handleStatus for the structured payment data Payone does expose).",
    );
  }

  /**
   * NOT SUPPORTED (deliberate, permanent decision) - same bounded-check finding as
   * `getPaymentReceiptInfo` above: no file/document-download endpoint (PDF or otherwise) exists
   * anywhere in this SDK's surface for Payone to hand back a receipt file/`contentType` pair.
   */
  async getPaymentReceiptFiles(_args: {
    paymentSystemParams: unknown;
    orderId: string;
    receiptFormat: string;
    paymentControlSchema: unknown;
  }): Promise<Array<{ fileBuffer: ArrayBuffer; contentType: string }>> {
    throw new Error(
      "getPaymentReceiptFiles is not supported by the Payone provider (Payone's Commerce Platform API has no receipt/document file-download endpoint).",
    );
  }

  /**
   * NOT SUPPORTED (deliberate, permanent decision). Task 11's bounded check found no
   * payout/withdrawal-status endpoint or model anywhere in the 8 endpoint clients or
   * `docs.payone.com/pcp/commerce-platform-api` (the closest surface, `PaymentExecutionApiClient`
   * /`PaymentInformationApiClient`, only cover collecting/refunding/cancelling a *customer's*
   * payment into the merchant, never a separate merchant-side "withdrawal" of settled funds).
   * PAYONE settles collected funds to the merchant's own bank account per the merchant's
   * commercial agreement with PAYONE, outside of any API surface this SDK exposes - there is no
   * per-order "withdrawal" resource for this method to query the status of.
   */
  async getWithdrawalFundsStatus(_args: {
    paymentSystemParams: unknown;
    orderId: string;
  }): Promise<never> {
    throw new Error(
      "getWithdrawalFundsStatus is not supported by the Payone provider (Payone's Commerce Platform API has no per-order withdrawal/payout-status endpoint - settlement to the merchant's bank account happens outside this API).",
    );
  }

  /**
   * NOT SUPPORTED (deliberate, permanent decision). `sendCheckRequest` has no PAYONE-specific
   * meaning found anywhere in this SDK's surface or PAYONE's docs during the bounded check - the
   * base `Provider.sendCheckRequest` (`components/task/src/services/payment/providers/
   * provider.ts`) is an unconditional "must be overridden" abstract stub with no documented
   * generic contract either, and the naming (a fiscal "check"/receipt being sent, e.g. to a
   * national fiscal-receipt registrar) does not correspond to any concept in PAYONE's card/
   * redirect Commerce Platform API, which is not fiscalization-aware.
   */
  async sendCheckRequest(_providerOptions: unknown): Promise<never> {
    throw new Error(
      "sendCheckRequest is not supported by the Payone provider (this is a fiscal-receipt/check-registration concept with no equivalent in Payone's Commerce Platform API).",
    );
  }
}
