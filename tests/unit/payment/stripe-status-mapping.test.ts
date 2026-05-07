import { describe, expect, it, vi } from 'vitest';

const stripeMocks = vi.hoisted(() => ({
  createFetchHttpClient: vi.fn(() => ({})),
}));

vi.mock('stripe', () => {
  class MockStripe {
    static createFetchHttpClient = stripeMocks.createFetchHttpClient;
  }

  return {
    default: MockStripe,
  };
});

import { StripeProvider } from '@/extensions/payment/stripe';
import { SubscriptionStatus } from '@/extensions/payment/types';

const CURRENT_PERIOD_START = 1700000000;
const CURRENT_PERIOD_END = 1702592000;
const SCHEDULED_CANCEL_AT = 1702592000;
const ACTIVE_CANCELED_AT = 1700000100;
const CANCELED_AT = 1700000200;

type StripeStatus = 'active' | 'trialing' | 'canceled' | 'past_due' | 'unpaid';
type ExtendedStripeStatus =
  | StripeStatus
  | 'incomplete'
  | 'incomplete_expired'
  | 'paused'
  | 'something_new';

type CancellationDetails = {
  comment: string;
  feedback: string;
};

type MockSubscriptionOptions = {
  status: ExtendedStripeStatus;
  cancel_at?: number | null;
  canceled_at?: number | null;
  cancellation_details?: CancellationDetails;
};

type StatusMappingCase = MockSubscriptionOptions & {
  name: string;
  expected: SubscriptionStatus;
  expectedCanceledAt?: number;
  expectedCanceledEndAt?: number;
  expectedCanceledReason?: string;
};

function createProvider() {
  return new StripeProvider({
    secretKey: 'sk_test',
    publishableKey: 'pk_test',
    signingSecret: 'whsec_test',
  });
}

function createMockSubscription({
  status,
  cancel_at = null,
  canceled_at = null,
  cancellation_details = { comment: '', feedback: '' },
}: MockSubscriptionOptions) {
  return {
    id: 'sub_test',
    status,
    cancel_at,
    canceled_at,
    cancellation_details,
    metadata: {},
    items: {
      data: [
        {
          price: {
            id: 'price_test',
            product: 'prod_test',
            unit_amount: 499,
            currency: 'usd',
          },
          plan: { interval: 'month', interval_count: 1 },
          current_period_start: CURRENT_PERIOD_START,
          current_period_end: CURRENT_PERIOD_END,
        },
      ],
    },
  };
}

async function buildSubscriptionInfo(
  provider: StripeProvider,
  subscription: ReturnType<typeof createMockSubscription>
) {
  return (provider as any).buildSubscriptionInfo(subscription);
}

function expectDateFromTimestamp(value: Date | undefined, timestamp: number) {
  expect(value).toBeInstanceOf(Date);
  expect(value?.getTime()).toBe(timestamp * 1000);
}

describe('StripeProvider subscription status mapping', () => {
  const statusMappingCases: StatusMappingCase[] = [
    {
      name: 'active without scheduled cancellation',
      status: 'active',
      expected: SubscriptionStatus.ACTIVE,
    },
    {
      name: 'active with scheduled cancellation',
      status: 'active',
      cancel_at: SCHEDULED_CANCEL_AT,
      canceled_at: ACTIVE_CANCELED_AT,
      expected: SubscriptionStatus.PENDING_CANCEL,
      expectedCanceledAt: ACTIVE_CANCELED_AT,
      expectedCanceledEndAt: SCHEDULED_CANCEL_AT,
    },
    {
      name: 'trialing',
      status: 'trialing',
      expected: SubscriptionStatus.TRIALING,
    },
    {
      name: 'canceled',
      status: 'canceled',
      canceled_at: CANCELED_AT,
      cancellation_details: {
        comment: 'No longer needed',
        feedback: 'unused',
      },
      expected: SubscriptionStatus.CANCELED,
      expectedCanceledAt: CANCELED_AT,
      expectedCanceledReason: 'No longer needed',
    },
    {
      name: 'past_due',
      status: 'past_due',
      expected: SubscriptionStatus.PAST_DUE,
    },
    {
      name: 'unpaid',
      status: 'unpaid',
      expected: SubscriptionStatus.UNPAID,
    },
    {
      name: 'incomplete',
      status: 'incomplete',
      expected: SubscriptionStatus.INCOMPLETE,
    },
    {
      name: 'incomplete_expired',
      status: 'incomplete_expired',
      expected: SubscriptionStatus.INCOMPLETE_EXPIRED,
    },
    {
      name: 'paused',
      status: 'paused',
      expected: SubscriptionStatus.PAUSED,
    },
  ];

  it.each(statusMappingCases)('maps $name to $expected', async (testCase) => {
    const provider = createProvider();
    const result = await buildSubscriptionInfo(
      provider,
      createMockSubscription(testCase)
    );

    expect(result.status).toBe(testCase.expected);

    if (testCase.expectedCanceledAt) {
      expectDateFromTimestamp(result.canceledAt, testCase.expectedCanceledAt);
    }

    if (testCase.expectedCanceledEndAt) {
      expectDateFromTimestamp(
        result.canceledEndAt,
        testCase.expectedCanceledEndAt
      );
    }

    if (testCase.expectedCanceledReason) {
      expect(result.canceledReason).toBe(testCase.expectedCanceledReason);
    }
  });

  it('throws for unknown subscription status', async () => {
    const provider = createProvider();

    await expect(
      buildSubscriptionInfo(
        provider,
        createMockSubscription({ status: 'something_new' })
      )
    ).rejects.toThrow('Unknown Stripe subscription status: something_new');
  });
});
