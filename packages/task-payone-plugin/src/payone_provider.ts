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

  constructor(context: PluginContext, options: PayoneOptions) {
    super(context, options);
    const config = new CommunicatorConfiguration(
      options.apiKey,
      options.apiSecret,
      options.baseUrl,
    );
    this.commerceCaseClient = new CommerceCaseApiClient(config);
    this.checkoutClient = new CheckoutApiClient(config);
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

  /** TEMPORARY stub - not applicable/implemented until task 11 decides scope. */
  async confirmBySmsCode(
    _providerOptions: unknown,
    _calculatedData: unknown,
    _smsCode: string,
  ): Promise<unknown> {
    throw new Error("PayoneProvider.confirmBySmsCode: not implemented yet");
  }

  /** TEMPORARY stub - implemented in task 11. */
  async cancelOrder(
    _providerOptions: unknown,
    _orderId: string,
    _transactionId: string,
    _sessionId: string,
  ): Promise<unknown> {
    throw new Error("PayoneProvider.cancelOrder: not implemented yet");
  }

  /** TEMPORARY stub - implemented in task 11. */
  async unHoldOrder(_data: unknown): Promise<unknown> {
    throw new Error("PayoneProvider.unHoldOrder: not implemented yet");
  }

  /** TEMPORARY stub - implemented in task 11. */
  async checkStatus(
    _providerOptions: unknown,
    _sessionId: string,
    _invoiceId: string,
  ): Promise<unknown> {
    throw new Error("PayoneProvider.checkStatus: not implemented yet");
  }

  /** TEMPORARY stub - implemented in task 11. */
  async getPaymentReceiptInfo(_args: {
    paymentSystemParams: unknown;
    orderId: string;
  }): Promise<unknown> {
    throw new Error(
      "PayoneProvider.getPaymentReceiptInfo: not implemented yet",
    );
  }

  /** TEMPORARY stub - implemented in task 11. */
  async getPaymentReceiptFiles(_args: {
    paymentSystemParams: unknown;
    orderId: string;
    receiptFormat: string;
    paymentControlSchema: unknown;
  }): Promise<Array<{ fileBuffer: ArrayBuffer; contentType: string }>> {
    throw new Error(
      "PayoneProvider.getPaymentReceiptFiles: not implemented yet",
    );
  }

  /** TEMPORARY stub - implemented in task 11. */
  async getWithdrawalFundsStatus(_args: {
    paymentSystemParams: unknown;
    orderId: string;
  }): Promise<unknown> {
    throw new Error(
      "PayoneProvider.getWithdrawalFundsStatus: not implemented yet",
    );
  }

  /** TEMPORARY stub - implemented in task 11. */
  async sendCheckRequest(_providerOptions: unknown): Promise<unknown> {
    throw new Error("PayoneProvider.sendCheckRequest: not implemented yet");
  }
}
