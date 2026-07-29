import { PluginContext } from "@liquio/plugin-sdk";

const createCommerceCaseRequestMock = jest.fn();

// `pcp-server-nodejs-sdk` ships ESM-only output, so `jest.requireActual` can't load it under
// ts-jest's CommonJS transform - instead, re-declare just the bits this spec needs (the real
// enum/error classes' shapes, mirrored from the installed `.d.ts` files) rather than mocking the
// whole module blind.
jest.mock("pcp-server-nodejs-sdk", () => {
  enum OrderType {
    Full = "FULL",
    Partial = "PARTIAL",
  }

  class ApiException extends Error {
    constructor(
      private readonly statusCode: number,
      private readonly responseBody: string,
    ) {
      super(`ApiException: ${statusCode}`);
    }
    getStatusCode(): number {
      return this.statusCode;
    }
    getResponseBody(): string {
      return this.responseBody;
    }
  }

  class ApiErrorResponseException extends ApiException {
    constructor(
      statusCode: number,
      responseBody: string,
      private readonly errors: unknown[] = [],
    ) {
      super(statusCode, responseBody);
    }
    getErrors(): unknown[] {
      return this.errors;
    }
  }

  class ApiResponseRetrievalException extends ApiException {}

  return {
    OrderType,
    ApiException,
    ApiErrorResponseException,
    ApiResponseRetrievalException,
    CommunicatorConfiguration: jest.fn(),
    CommerceCaseApiClient: jest.fn().mockImplementation(() => ({
      createCommerceCaseRequest: createCommerceCaseRequestMock,
    })),
  };
});

import {
  ApiErrorResponseException,
  CommerceCaseApiClient,
  CommunicatorConfiguration,
  OrderType,
} from "pcp-server-nodejs-sdk";

import { PayoneProvider } from "./payone_provider";
import { PayoneOptions, PayoneResolvedPaymentData } from "./types";

describe("PayoneProvider", () => {
  const context: PluginContext = {
    log: { save: jest.fn() } as unknown as PluginContext["log"],
    pluginConfig: {},
  };

  const options: PayoneOptions = {
    apiKey: "test-api-key",
    apiSecret: "test-api-secret",
    baseUrl: "https://api.preprod.commerce.payone.com",
    merchantId: "merchant-123",
    paymentProductId: 809,
    defaultRedirectUrl: "https://example.com/default-return",
    defaultCurrency: "EUR",
  };

  const resolvedData: PayoneResolvedPaymentData = {
    amount: 100.5,
    orderId: "order-42",
    description: "Test payment",
    returnUrl: "https://example.com/return",
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("builds the SDK client in the constructor without throwing", () => {
    expect(() => new PayoneProvider(context, options)).not.toThrow();
    expect(CommunicatorConfiguration).toBeDefined();
    expect(CommerceCaseApiClient).toHaveBeenCalledTimes(1);
  });

  describe("calculatePayment", () => {
    it("sends the correct request shape and returns the extracted redirect URL", async () => {
      createCommerceCaseRequestMock.mockResolvedValue({
        commerceCaseId: "commerce-case-1",
        checkout: {
          checkoutId: "checkout-1",
          paymentResponse: {
            paymentExecutionId: "exec-1",
            merchantAction: {
              redirectData: {
                redirectURL: "https://secure.payone.com/redirect/abc",
              },
            },
          },
        },
      });

      const provider = new PayoneProvider(context, options);
      const result = await provider.calculatePayment(resolvedData);

      expect(createCommerceCaseRequestMock).toHaveBeenCalledWith(
        "merchant-123",
        {
          merchantReference: "order-42",
          checkout: {
            amountOfMoney: {
              amount: 10050,
              currencyCode: "EUR",
            },
            autoExecuteOrder: true,
            orderRequest: {
              orderType: OrderType.Full,
              paymentMethodSpecificInput: {
                redirectPaymentMethodSpecificInput: {
                  paymentProductId: 809,
                  redirectionData: {
                    returnUrl: "https://example.com/return",
                  },
                },
              },
            },
          },
        },
      );

      // Sanity: amount must be an integer number of cents, never a float carrying decimals.
      const sentRequest = createCommerceCaseRequestMock.mock.calls[0][1];
      expect(Number.isInteger(sentRequest.checkout.amountOfMoney.amount)).toBe(
        true,
      );

      expect(result).toEqual({
        redirectUrl: "https://secure.payone.com/redirect/abc",
        commerceCaseId: "commerce-case-1",
        checkoutId: "checkout-1",
        paymentExecutionId: "exec-1",
        orderId: "order-42",
        amount: 100.5,
        currency: "EUR",
      });
    });

    it("falls back to defaultRedirectUrl and defaultCurrency when data does not supply them", async () => {
      createCommerceCaseRequestMock.mockResolvedValue({
        commerceCaseId: "commerce-case-2",
        checkout: {
          checkoutId: "checkout-2",
          paymentResponse: {
            merchantAction: {
              redirectData: {
                redirectURL: "https://secure.payone.com/redirect/def",
              },
            },
          },
        },
      });

      const provider = new PayoneProvider(context, options);
      await provider.calculatePayment({
        amount: 5,
        orderId: "order-99",
      } as PayoneResolvedPaymentData);

      const sentRequest = createCommerceCaseRequestMock.mock.calls[0][1];
      expect(sentRequest.checkout.amountOfMoney.currencyCode).toBe("EUR");
      expect(
        sentRequest.checkout.orderRequest.paymentMethodSpecificInput
          .redirectPaymentMethodSpecificInput.redirectionData.returnUrl,
      ).toBe("https://example.com/default-return");
    });

    it("throws a descriptive error when the response has no redirect URL", async () => {
      createCommerceCaseRequestMock.mockResolvedValue({
        commerceCaseId: "commerce-case-3",
        checkout: {},
      });

      const provider = new PayoneProvider(context, options);
      await expect(provider.calculatePayment(resolvedData)).rejects.toThrow(
        /did not contain a redirect URL/,
      );
    });

    it("throws when amount is missing/non-numeric", async () => {
      const provider = new PayoneProvider(context, options);
      await expect(
        provider.calculatePayment({
          orderId: "order-1",
        } as unknown as PayoneResolvedPaymentData),
      ).rejects.toThrow(/missing a numeric "amount"/);
      expect(createCommerceCaseRequestMock).not.toHaveBeenCalled();
    });

    it("translates a thrown ApiErrorResponseException into a clear error instead of letting it escape opaquely", async () => {
      const apiError = new ApiErrorResponseException(
        400,
        '{"errors":[{"code":"1001"}]}',
        [{ code: "1001" } as never],
      );
      createCommerceCaseRequestMock.mockRejectedValue(apiError);

      const provider = new PayoneProvider(context, options);

      await expect(provider.calculatePayment(resolvedData)).rejects.toThrow(
        /PAYONE API returned an error response \(status 400\)/,
      );
    });
  });
});
