import { and, eq } from 'drizzle-orm';

import { credit as creditTable } from '@/config/db/schema';
import { db } from '@/core/db';
import { captureServerError } from '@/extensions/monitoring/sentry';
import {
  CreemProvider,
  PaymentManager,
  PayPalProvider,
  StripeProvider,
} from '@/extensions/payment';
import {
  PaymentSession,
  PaymentStatus,
  PaymentType,
} from '@/extensions/payment/types';
import { getSnowId, getUuid } from '@/shared/lib/hash';
import { Configs, getAllConfigs } from '@/shared/models/config';

import {
  calculateCreditExpirationTime,
  CreditStatus,
  CreditTransactionScene,
  CreditTransactionType,
  NewCredit,
} from '../models/credit';
import {
  findOrderByOrderNo,
  NewOrder,
  Order,
  OrderStatus,
  UpdateOrder,
  updateOrderByOrderNo,
  updateOrderInTransaction,
  updateSubscriptionInTransaction,
} from '../models/order';
import {
  NewSubscription,
  Subscription,
  SubscriptionStatus,
  UpdateSubscription,
  updateSubscriptionBySubscriptionNo,
} from '../models/subscription';

/**
 * get payment service with configs
 */
export function getPaymentServiceWithConfigs(configs: Configs) {
  const paymentManager = new PaymentManager();

  const defaultProvider = configs.default_payment_provider;

  // add stripe provider
  if (configs.stripe_enabled === 'true') {
    let allowedPaymentMethods = configs.stripe_payment_methods || [];
    if (typeof allowedPaymentMethods === 'string') {
      try {
        allowedPaymentMethods = JSON.parse(allowedPaymentMethods);
      } catch (e) {
        console.error('parse stripe payment methods error', e);
        allowedPaymentMethods = [];
      }
    }
    paymentManager.addProvider(
      new StripeProvider({
        secretKey: configs.stripe_secret_key,
        publishableKey: configs.stripe_publishable_key,
        signingSecret: configs.stripe_signing_secret,
        allowedPaymentMethods: allowedPaymentMethods as string[],
        allowPromotionCodes: configs.stripe_allow_promotion_codes === 'true',
      }),
      defaultProvider === 'stripe'
    );
  }

  // add creem provider
  if (configs.creem_enabled === 'true') {
    paymentManager.addProvider(
      new CreemProvider({
        apiKey: configs.creem_api_key,
        environment:
          configs.creem_environment === 'production' ? 'production' : 'sandbox',
        signingSecret: configs.creem_signing_secret,
      }),
      defaultProvider === 'creem'
    );
  }

  // add paypal provider
  if (configs.paypal_enabled === 'true') {
    paymentManager.addProvider(
      new PayPalProvider({
        clientId: configs.paypal_client_id,
        clientSecret: configs.paypal_client_secret,
        environment:
          configs.paypal_environment === 'production'
            ? 'production'
            : 'sandbox',
      }),
      defaultProvider === 'paypal'
    );
  }

  return paymentManager;
}

/**
 * global payment service
 */
let paymentService: PaymentManager | null = null;

/**
 * get payment service instance
 */
export async function getPaymentService(
  configs?: Configs
): Promise<PaymentManager> {
  if (!configs) {
    configs = await getAllConfigs();
  }
  paymentService = getPaymentServiceWithConfigs(configs);

  return paymentService;
}

/**
 * Build update order fields from a successful payment session
 */
function buildSuccessUpdateOrder(
  session: PaymentSession
): UpdateOrder {
  return {
    status: OrderStatus.PAID,
    paymentResult: JSON.stringify(session.paymentResult),
    paymentAmount: session.paymentInfo?.paymentAmount,
    paymentCurrency: session.paymentInfo?.paymentCurrency,
    discountAmount: session.paymentInfo?.discountAmount,
    discountCurrency: session.paymentInfo?.discountCurrency,
    discountCode: session.paymentInfo?.discountCode,
    paymentEmail: session.paymentInfo?.paymentEmail,
    paymentUserName: session.paymentInfo?.paymentUserName,
    paymentUserId: session.paymentInfo?.paymentUserId,
    paidAt: session.paymentInfo?.paidAt,
    invoiceId: session.paymentInfo?.invoiceId,
    invoiceUrl: session.paymentInfo?.invoiceUrl,
    transactionId: session.paymentInfo?.transactionId,
  };
}

/**
 * Build new subscription from order and session info
 */
function buildNewSubscription(
  order: Order,
  session: PaymentSession
): NewSubscription | undefined {
  const subscriptionInfo = session.subscriptionInfo;
  if (!subscriptionInfo) return undefined;

  return {
    id: getUuid(),
    subscriptionNo: getSnowId(),
    userId: order.userId,
    userEmail: order.paymentEmail || order.userEmail,
    status: subscriptionInfo.status || SubscriptionStatus.ACTIVE,
    paymentProvider: order.paymentProvider,
    subscriptionId: subscriptionInfo.subscriptionId,
    subscriptionResult: JSON.stringify(session.subscriptionResult),
    productId: order.productId,
    description: subscriptionInfo.description || 'Subscription Created',
    amount: subscriptionInfo.amount,
    currency: subscriptionInfo.currency,
    interval: subscriptionInfo.interval,
    intervalCount: subscriptionInfo.intervalCount,
    trialPeriodDays: subscriptionInfo.trialPeriodDays,
    currentPeriodStart: subscriptionInfo.currentPeriodStart,
    currentPeriodEnd: subscriptionInfo.currentPeriodEnd,
    billingUrl: subscriptionInfo.billingUrl,
    planName: order.planName || order.productName,
    productName: order.productName,
    creditsAmount: order.creditsAmount,
    creditsValidDays: order.creditsValidDays,
    paymentProductId: order.paymentProductId,
    paymentUserId: session.paymentInfo?.paymentUserId,
  };
}

/**
 * Build new credit grant for an order
 */
function buildNewCredit(
  order: Order,
  subscriptionNo: string | undefined,
  currentPeriodEnd: string | Date | undefined
): NewCredit | undefined {
  if (!order.creditsAmount || order.creditsAmount <= 0) return undefined;

  const credits = order.creditsAmount;
  const periodEndDate = currentPeriodEnd
    ? currentPeriodEnd instanceof Date
      ? currentPeriodEnd
      : new Date(currentPeriodEnd)
    : undefined;
  const expiresAt = calculateCreditExpirationTime({
    creditsValidDays: order.creditsValidDays || 0,
    currentPeriodEnd: periodEndDate,
  });

  return {
    id: getUuid(),
    userId: order.userId,
    userEmail: order.userEmail,
    orderNo: order.orderNo,
    subscriptionNo,
    transactionNo: getSnowId(),
    transactionType: CreditTransactionType.GRANT,
    transactionScene:
      order.paymentType === PaymentType.SUBSCRIPTION
        ? CreditTransactionScene.SUBSCRIPTION
        : CreditTransactionScene.PAYMENT,
    credits,
    remainingCredits: credits,
    description: 'Grant credit',
    expiresAt,
    status: CreditStatus.ACTIVE,
  };
}

/**
 * Process a successful payment — shared by checkout and webhook handlers
 */
async function processSuccessfulPayment(
  order: Order,
  session: PaymentSession
) {
  const orderNo = order.orderNo!;
  const updateOrder = buildSuccessUpdateOrder(session);
  const newSubscription = buildNewSubscription(order, session);

  if (newSubscription) {
    updateOrder.subscriptionNo = newSubscription.subscriptionNo;
    updateOrder.subscriptionId = session.subscriptionId;
    updateOrder.subscriptionResult = JSON.stringify(
      session.subscriptionResult
    );
  }

  const newCredit = buildNewCredit(
    order,
    newSubscription?.subscriptionNo,
    session.subscriptionInfo?.currentPeriodEnd
  );

  await updateOrderInTransaction({
    orderNo,
    updateOrder,
    newSubscription,
    newCredit,
  });
}

/**
 * Validate order and session for payment processing
 */
function validatePaymentInput(order: Order, session: PaymentSession) {
  if (!order.orderNo) {
    throw new Error('invalid order');
  }
  if (order.paymentType === PaymentType.SUBSCRIPTION) {
    if (!session.subscriptionId || !session.subscriptionInfo) {
      throw new Error('subscription id or subscription info not found');
    }
  }
}

/**
 * handle checkout success (supports all payment statuses)
 */
export async function handleCheckoutSuccess({
  order,
  session,
}: {
  order: Order;
  session: PaymentSession;
}) {
  validatePaymentInput(order, session);

  if (session.paymentStatus === PaymentStatus.SUCCESS) {
    await processSuccessfulPayment(order, session);
  } else if (
    session.paymentStatus === PaymentStatus.FAILED ||
    session.paymentStatus === PaymentStatus.CANCELED
  ) {
    await updateOrderByOrderNo(order.orderNo!, {
      status: OrderStatus.FAILED,
      paymentResult: JSON.stringify(session.paymentResult),
    });
  } else if (session.paymentStatus === PaymentStatus.PROCESSING) {
    await updateOrderByOrderNo(order.orderNo!, {
      paymentResult: JSON.stringify(session.paymentResult),
    });
  } else {
    throw new Error('unknown payment status');
  }
}

/**
 * handle payment success (webhook — only SUCCESS status)
 */
export async function handlePaymentSuccess({
  order,
  session,
}: {
  order: Order;
  session: PaymentSession;
}) {
  validatePaymentInput(order, session);

  if (session.paymentStatus !== PaymentStatus.SUCCESS) {
    throw new Error('unknown payment status');
  }

  await processSuccessfulPayment(order, session);
}

export async function handleSubscriptionRenewal({
  subscription,
  session,
}: {
  subscription: Subscription; // subscription
  session: PaymentSession; // payment session
}) {
  const subscriptionNo = subscription.subscriptionNo;
  if (!subscriptionNo || !subscription.amount || !subscription.currency) {
    throw new Error('invalid subscription');
  }

  if (!session.subscriptionId || !session.subscriptionInfo) {
    throw new Error('invalid payment session');
  }
  if (session.subscriptionId !== subscription.subscriptionId) {
    throw new Error('subscription id mismatch');
  }

  const subscriptionInfo = session.subscriptionInfo;
  if (
    !subscriptionInfo ||
    !subscriptionInfo.currentPeriodStart ||
    !subscriptionInfo.currentPeriodEnd
  ) {
    throw new Error('invalid subscription info');
  }

  // payment success
  if (session.paymentStatus === PaymentStatus.SUCCESS) {
    // update subscription period
    const updateSubscription: UpdateSubscription = {
      currentPeriodStart: subscriptionInfo.currentPeriodStart,
      currentPeriodEnd: subscriptionInfo.currentPeriodEnd,
    };

    const orderNo = getSnowId();
    const currentTime = new Date();

    // renewal order
    const order: NewOrder = {
      id: getUuid(),
      orderNo: orderNo,
      userId: subscription.userId,
      userEmail: subscription.userEmail,
      status: OrderStatus.PAID,
      amount: subscription.amount,
      currency: subscription.currency,
      productId: subscription.productId,
      paymentType: PaymentType.RENEW,
      paymentInterval: subscription.interval,
      paymentProvider: session.provider || subscription.paymentProvider,
      checkoutInfo: '',
      createdAt: currentTime,
      productName: subscription.productName,
      description: 'Subscription Renewal',
      callbackUrl: '',
      creditsAmount: subscription.creditsAmount,
      creditsValidDays: subscription.creditsValidDays,
      planName: subscription.planName || '',
      paymentProductId: subscription.paymentProductId,
      paymentResult: JSON.stringify(session.paymentResult),
      paymentAmount: session.paymentInfo?.paymentAmount,
      paymentCurrency: session.paymentInfo?.paymentCurrency,
      discountAmount: session.paymentInfo?.discountAmount,
      discountCurrency: session.paymentInfo?.discountCurrency,
      discountCode: session.paymentInfo?.discountCode,
      paymentEmail: session.paymentInfo?.paymentEmail,
      paymentUserId: session.paymentInfo?.paymentUserId,
      paidAt: session.paymentInfo?.paidAt,
      invoiceId: session.paymentInfo?.invoiceId,
      invoiceUrl: session.paymentInfo?.invoiceUrl,
      subscriptionNo: subscription.subscriptionNo,
      transactionId: session.paymentInfo?.transactionId,
      paymentUserName: session.paymentInfo?.paymentUserName,
      subscriptionId: session.subscriptionId,
      subscriptionResult: JSON.stringify(session.subscriptionResult),
    };

    // grant credit for renewal order
    let newCredit: NewCredit | undefined = undefined;
    if (order.creditsAmount && order.creditsAmount > 0) {
      const credits = order.creditsAmount;
      const expiresAt =
        credits > 0
          ? calculateCreditExpirationTime({
              creditsValidDays: order.creditsValidDays || 0,
              currentPeriodEnd: subscriptionInfo?.currentPeriodEnd,
            })
          : null;

      newCredit = {
        id: getUuid(),
        userId: order.userId,
        userEmail: order.userEmail,
        orderNo: order.orderNo,
        subscriptionNo: subscription.subscriptionNo,
        transactionNo: getSnowId(),
        transactionType: CreditTransactionType.GRANT,
        transactionScene:
          order.paymentType === PaymentType.SUBSCRIPTION
            ? CreditTransactionScene.SUBSCRIPTION
            : CreditTransactionScene.PAYMENT,
        credits: credits,
        remainingCredits: credits,
        description: `Grant credit`,
        expiresAt: expiresAt,
        status: CreditStatus.ACTIVE,
      };
    }

    await updateSubscriptionInTransaction({
      subscriptionNo,
      updateSubscription,
      newOrder: order,
      newCredit,
    });
  } else {
    throw new Error('unknown payment status');
  }
}

export async function handleSubscriptionUpdated({
  subscription,
  session,
}: {
  subscription: Subscription; // subscription
  session: PaymentSession; // payment session
}) {
  const subscriptionNo = subscription.subscriptionNo;
  if (!subscriptionNo || !subscription.amount || !subscription.currency) {
    throw new Error('invalid subscription');
  }

  const subscriptionInfo = session.subscriptionInfo;
  if (!subscriptionInfo || !subscriptionInfo.status) {
    throw new Error('invalid subscription info');
  }

  let updateSubscriptionStatus: SubscriptionStatus = subscriptionInfo.status;

  await updateSubscriptionBySubscriptionNo(subscriptionNo, {
    status: updateSubscriptionStatus,
    currentPeriodStart: subscriptionInfo.currentPeriodStart,
    currentPeriodEnd: subscriptionInfo.currentPeriodEnd,
    canceledAt: subscriptionInfo.canceledAt || null,
    canceledEndAt: subscriptionInfo.canceledEndAt || null,
    canceledReason: subscriptionInfo.canceledReason || '',
    canceledReasonType: subscriptionInfo.canceledReasonType || '',
  });

  // console.log('handle subscription updated', subscriptionInfo);
}

export async function handleSubscriptionCanceled({
  subscription,
  session,
}: {
  subscription: Subscription; // subscription
  session: PaymentSession; // payment session
}) {
  const subscriptionNo = subscription.subscriptionNo;
  if (!subscriptionNo || !subscription.amount || !subscription.currency) {
    throw new Error('invalid subscription');
  }

  const subscriptionInfo = session.subscriptionInfo;
  if (
    !subscriptionInfo ||
    !subscriptionInfo.status ||
    !subscriptionInfo.canceledAt
  ) {
    throw new Error('invalid subscription info');
  }

  await updateSubscriptionBySubscriptionNo(subscriptionNo, {
    status: SubscriptionStatus.CANCELED,
    canceledAt: subscriptionInfo.canceledAt,
    canceledEndAt: subscriptionInfo.canceledEndAt,
    canceledReason: subscriptionInfo.canceledReason,
    canceledReasonType: subscriptionInfo.canceledReasonType,
  });

  // console.log('handle subscription canceled', subscriptionInfo);
}

export async function handleSubscriptionPaymentFailed({
  subscription,
  session,
}: {
  subscription: Subscription;
  session: PaymentSession;
}) {
  const subscriptionNo = subscription.subscriptionNo;
  if (!subscriptionNo) {
    throw new Error('invalid subscription');
  }

  // Stripe past_due: payment failed but Stripe will retry per the
  // subscription's retry policy. Don't cancel, just mark overdue.
  await updateSubscriptionBySubscriptionNo(subscriptionNo, {
    status: SubscriptionStatus.PAST_DUE,
  });
}

export async function handleRefund({
  order,
  session,
}: {
  order: Order;
  session: PaymentSession;
}): Promise<void> {
  // Partial refunds need manual admin credit adjustment; full refunds are safe to automate.
  const meta = (session.metadata ?? {}) as {
    charge_amount?: number;
    charge_amount_refunded?: number;
  };
  if (
    typeof meta.charge_amount === 'number' &&
    typeof meta.charge_amount_refunded === 'number' &&
    meta.charge_amount_refunded < meta.charge_amount
  ) {
    captureServerError(new Error('partial_refund_received'), {
      orderNo: order.orderNo,
      chargeAmount: meta.charge_amount,
      refundedAmount: meta.charge_amount_refunded,
    });
    return;
  }

  await updateOrderInTransaction({
    orderNo: order.orderNo,
    updateOrder: {
      status: OrderStatus.REFUNDED,
      paymentResult: JSON.stringify(session.paymentResult),
    },
  });

  await db()
    .update(creditTable)
    .set({
      status: CreditStatus.EXPIRED,
      remainingCredits: 0,
    })
    .where(
      and(
        eq(creditTable.orderNo, order.orderNo),
        eq(creditTable.transactionType, CreditTransactionType.GRANT)
      )
    );

  if (order.subscriptionNo && order.subscriptionId && order.paymentProvider) {
    const paymentService = await getPaymentService();
    const provider = paymentService.getProvider(order.paymentProvider);
    if (provider?.cancelSubscription) {
      try {
        await provider.cancelSubscription({
          subscriptionId: order.subscriptionId,
        });
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : String(err);
        // Idempotent: Stripe may already have canceled before this webhook arrives.
        if (msg.includes('No such subscription') || msg.includes('canceled')) {
          return;
        }
        throw err;
      }
    }
  }
}
