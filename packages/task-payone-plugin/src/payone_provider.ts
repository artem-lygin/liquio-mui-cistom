import { PluginContext, TaskPaymentProvider } from "@liquio/plugin-sdk";
import {
  ApiErrorResponseException,
  ApiException,
  ApiResponseRetrievalException,
  CommerceCaseApiClient,
  CommunicatorConfiguration,
  CreateCommerceCaseRequest,
  OrderType,
} from "pcp-server-nodejs-sdk";

import {
  PayoneCalculatedPaymentData,
  PayoneOptions,
  PayoneResolvedPaymentData,
} from "./types";

/**
 * PAYONE Commerce Platform payment provider for `components/task`.
 *
 * v1 scope is redirect/hosted-checkout only (see plan §5.4/§8.2) - card tokenization requires
 * client-side tokenizer work in `cabinet-front` and is explicitly out of scope here.
 */
export class PayoneProvider extends TaskPaymentProvider<PayoneOptions> {
  private readonly commerceCaseClient: CommerceCaseApiClient;

  constructor(context: PluginContext, options: PayoneOptions) {
    super(context, options);
    const config = new CommunicatorConfiguration(
      options.apiKey,
      options.apiSecret,
      options.baseUrl,
    );
    this.commerceCaseClient = new CommerceCaseApiClient(config);
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
    const returnUrl = payload.returnUrl ?? this.options.defaultRedirectUrl;

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

  /** TEMPORARY stub - implemented in task 10. */
  async handleStatus(
    _data: unknown,
    _providerOptions: unknown,
    _status: string,
    _queryParamsObject: unknown,
    _headersObject: unknown,
    _checkPrevTransaction?: boolean,
  ): Promise<unknown> {
    throw new Error("PayoneProvider.handleStatus: not implemented yet");
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
