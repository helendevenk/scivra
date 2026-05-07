import { describe, expect, it, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  createFetchHttpClient: vi.fn(() => ({})),
  subscriptionsRetrieve: vi.fn(),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;

    subscriptions = {
      retrieve: stripeMocks.subscriptionsRetrieve,
    };
  }

  return {
    default: MockStripe,
  };
});

import { StripeProvider } from '@/extensions/payment/stripe';

type DiscountAmount = {
  amount: number;
  discount: string;
};

type TotalDiscountAmounts = DiscountAmount[] | null | undefined;

function createProvider() {
  return new StripeProvider({
    secretKey: 'sk_test',
    publishableKey: 'pk_test',
    signingSecret: 'whsec_test',
  });
}

function createInvoice(totalDiscountAmounts: TotalDiscountAmounts) {
  return {
    id: 'in_test',
    total_discount_amounts: totalDiscountAmounts,
    currency: 'usd',
    amount_paid: 499,
    customer_email: 'test@example.com',
    customer_name: 'Test',
    customer: 'cus_test',
    created: 1700000000,
    hosted_invoice_url: '',
    billing_reason: 'subscription_create',
    metadata: {},
    lines: { data: [] },
  };
}

async function buildInvoiceDiscountAmount(
  totalDiscountAmounts: TotalDiscountAmounts
) {
  const provider = createProvider();
  const mockInvoice = createInvoice(totalDiscountAmounts);
  const result = await (provider as any).buildPaymentSessionFromInvoice(
    mockInvoice
  );

  return result.paymentInfo.discountAmount;
}

describe('StripeProvider invoice discount amount', () => {
  const cases: Array<{
    name: string;
    totalDiscountAmounts: TotalDiscountAmounts;
    expected: number;
  }> = [
    {
      name: 'undefined total_discount_amounts',
      totalDiscountAmounts: undefined,
      expected: 0,
    },
    {
      name: 'null total_discount_amounts',
      totalDiscountAmounts: null,
      expected: 0,
    },
    {
      name: 'empty total_discount_amounts',
      totalDiscountAmounts: [],
      expected: 0,
    },
    {
      name: 'single total_discount_amounts entry',
      totalDiscountAmounts: [{ amount: 500, discount: 'di_test_1' }],
      expected: 500,
    },
    {
      name: 'multiple total_discount_amounts entries',
      totalDiscountAmounts: [
        { amount: 100, discount: 'di_test_1' },
        { amount: 200, discount: 'di_test_2' },
      ],
      expected: 100,
    },
  ];

  it.each(cases)('sets discountAmount for $name', async (testCase) => {
    await expect(
      buildInvoiceDiscountAmount(testCase.totalDiscountAmounts)
    ).resolves.toBe(testCase.expected);
  });
});
