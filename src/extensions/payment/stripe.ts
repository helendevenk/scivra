import Stripe from 'stripe';

import {
  CheckoutSession,
  PaymentBilling,
  PaymentEventType,
  PaymentSignatureError,
  PaymentInterval,
  PaymentInvoice,
  PaymentStatus,
  PaymentType,
  SubscriptionCycleType,
  SubscriptionInfo,
  SubscriptionStatus,
  type PaymentConfigs,
  type PaymentEvent,
  type PaymentOrder,
  type PaymentProvider,
  type PaymentSession,
} from './types';

/**
 * Stripe payment provider configs
 * @docs https://stripe.com/docs
 */
export interface StripeConfigs extends PaymentConfigs {
  secretKey: string;
  publishableKey: string;
  signingSecret?: string;
  apiVersion?: string;
  allowedPaymentMethods?: string[];
  allowPromotionCodes?: boolean;
}

/**
 * Stripe payment provider implementation
 * @website https://stripe.com/
 */
export class StripeProvider implements PaymentProvider {
  readonly name = 'stripe';
  configs: StripeConfigs;

  private client: Stripe;

  constructor(configs: StripeConfigs) {
    this.configs = configs;
    this.client = new Stripe(configs.secretKey, {
      httpClient: Stripe.createFetchHttpClient(),
    });
  }

  async createPayment({
    order,
  }: {
    order: PaymentOrder;
  }): Promise<CheckoutSession> {
    try {
      // check payment price
      if (!order.price) {
        throw new Error('price is required');
      }

      // create payment with dynamic product

      // build price data
      const priceData: Stripe.Checkout.SessionCreateParams.LineItem.PriceData =
        {
          currency: order.price.currency,
          unit_amount: order.price.amount, // unit: cents
          product_data: {
            name: order.description || '',
          },
        };

      if (order.type === PaymentType.SUBSCRIPTION) {
        // create subscription payment

        // check payment plan
        if (!order.plan) {
          throw new Error('plan is required');
        }

        // build recurring data
        priceData.recurring = {
          interval: order.plan
            .interval as Stripe.Checkout.SessionCreateParams.LineItem.PriceData.Recurring.Interval,
        };
      } else {
        // create one-time payment
      }

      // set or create customer
      let customerId = '';
      if (order.customer?.email) {
        const customers = await this.client.customers.list({
          email: order.customer.email,
          limit: 1,
        });

        if (customers.data.length > 0) {
          customerId = customers.data[0].id;
        } else {
          const customer = await this.client.customers.create({
            email: order.customer.email,
            name: order.customer.name,
            metadata: order.customer.metadata,
          });
          customerId = customer.id;
        }
      }

      // create payment session params
      const sessionParams: Stripe.Checkout.SessionCreateParams = {
        mode:
          order.type === PaymentType.SUBSCRIPTION ? 'subscription' : 'payment',
        line_items: [
          {
            price_data: priceData,
            quantity: 1,
          },
        ],
      };

      // pre-set promotion code
      if (order.discount && order.discount.code) {
        sessionParams.discounts = [
          {
            promotion_code: order.discount.code,
          },
        ];
      }

      // allow user input promotion code
      if (this.configs.allowPromotionCodes && !sessionParams.discounts) {
        sessionParams.allow_promotion_codes = true;
      }

      // If currency is CNY, enable WeChat Pay and Alipay (only for one-time payments)
      // Note: WeChat Pay and Alipay through Stripe only supports one-time payments, not subscriptions
      const currency = order.price.currency.toLowerCase();
      if (currency === 'cny' && order.type === PaymentType.ONE_TIME) {
        // Enable WeChat Pay and Alipay for CNY one-time payments
        sessionParams.payment_method_types = [];
        sessionParams.payment_method_options = {};

        // get allowed payment methods
        const allowedPaymentMethods = this.configs.allowedPaymentMethods || [];

        if (allowedPaymentMethods.includes('card')) {
          sessionParams.payment_method_types.push('card');
        }
        if (allowedPaymentMethods.includes('wechat_pay')) {
          sessionParams.payment_method_types.push('wechat_pay');
          sessionParams.payment_method_options.wechat_pay = {
            client: 'web',
          };
        }
        if (allowedPaymentMethods.includes('alipay')) {
          sessionParams.payment_method_types.push('alipay');
          sessionParams.payment_method_options.alipay = {};
        }

        if (allowedPaymentMethods.length === 0) {
          // not set allowed payment methods, use default payment methods
          sessionParams.payment_method_types = ['card'];
        }
      }

      if (order.type === PaymentType.ONE_TIME) {
        sessionParams.invoice_creation = {
          enabled: true,
        };
      }

      if (customerId) {
        sessionParams.customer = customerId;
      }

      if (order.metadata) {
        sessionParams.metadata = order.metadata;
        // Stripe does NOT propagate session metadata to PaymentIntent or
        // Subscription objects. We must explicitly set them so the refund
        // webhook (charge.refunded) can read order_no from
        // charge.payment_intent.metadata (one-time) or
        // charge.invoice.subscription.metadata (subscription).
        if (order.type === PaymentType.SUBSCRIPTION) {
          sessionParams.subscription_data = {
            ...sessionParams.subscription_data,
            metadata: order.metadata,
          };
        } else {
          sessionParams.payment_intent_data = {
            ...sessionParams.payment_intent_data,
            metadata: order.metadata,
          };
        }
      }

      if (order.successUrl) {
        sessionParams.success_url = order.successUrl;
      }

      if (order.cancelUrl) {
        sessionParams.cancel_url = order.cancelUrl;
      }

      const session = await this.client.checkout.sessions.create(sessionParams);
      if (!session.id || !session.url) {
        throw new Error('create payment failed');
      }

      return {
        provider: this.name,
        checkoutParams: sessionParams,
        checkoutInfo: {
          sessionId: session.id,
          checkoutUrl: session.url,
        },
        checkoutResult: session,
        metadata: order.metadata || {},
      };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment session by session id
   */
  async getPaymentSession({
    sessionId,
  }: {
    sessionId: string;
  }): Promise<PaymentSession> {
    try {
      if (!sessionId) {
        throw new Error('sessionId is required');
      }

      const session = await this.client.checkout.sessions.retrieve(sessionId);

      return await this.buildPaymentSessionFromCheckoutSession(session);
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get payment event from webhook notification
   */
  async getPaymentEvent({
    req,
  }: {
    req: Request;
  }): Promise<PaymentEvent | null> {
    try {
      const rawBody = await req.text();
      const signature = req.headers.get('stripe-signature') as string;

      if (!rawBody || !signature) {
        throw new PaymentSignatureError(
          'Invalid webhook request: missing body or signature'
        );
      }

      if (!this.configs.signingSecret) {
        throw new Error('Signing Secret not configured');
      }

      let event: Stripe.Event;
      try {
        event = this.client.webhooks.constructEvent(
          rawBody,
          signature,
          this.configs.signingSecret
        );
      } catch (err) {
        throw new PaymentSignatureError(
          err instanceof Error
            ? err.message
            : 'Stripe signature verification failed'
        );
      }

      let paymentSession: PaymentSession | undefined = undefined;

      const eventType = this.mapStripeEventType(event.type);
      if (eventType === null) {
        return null;
      }

      if (eventType === PaymentEventType.CHECKOUT_SUCCESS) {
        paymentSession = await this.buildPaymentSessionFromCheckoutSession(
          event.data.object as Stripe.Response<Stripe.Checkout.Session>
        );
      } else if (
        eventType === PaymentEventType.PAYMENT_SUCCESS ||
        eventType === PaymentEventType.PAYMENT_FAILED
      ) {
        paymentSession = await this.buildPaymentSessionFromInvoice(
          event.data.object as Stripe.Response<Stripe.Invoice>
        );
      } else if (eventType === PaymentEventType.SUBSCRIBE_UPDATED) {
        paymentSession = await this.buildPaymentSessionFromSubscription(
          event.data.object as Stripe.Response<Stripe.Subscription>
        );
      } else if (eventType === PaymentEventType.SUBSCRIBE_CANCELED) {
        paymentSession = await this.buildPaymentSessionFromSubscription(
          event.data.object as Stripe.Response<Stripe.Subscription>
        );
      } else if (eventType === PaymentEventType.PAYMENT_REFUNDED) {
        paymentSession = await this.buildPaymentSessionFromCharge(
          event.data.object as Stripe.Charge
        );
      }

      if (!paymentSession) {
        throw new Error('Invalid webhook event');
      }

      return {
        eventType: eventType,
        eventResult: event,
        paymentSession: paymentSession,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentInvoice({
    invoiceId,
  }: {
    invoiceId: string;
  }): Promise<PaymentInvoice> {
    try {
      const invoice = await this.client.invoices.retrieve(invoiceId);
      if (!invoice.id) {
        throw new Error('Invoice not found');
      }

      return {
        invoiceId: invoice.id,
        invoiceUrl: invoice.hosted_invoice_url || undefined,
        amount: invoice.amount_paid,
        currency: invoice.currency,
      };
    } catch (error) {
      throw error;
    }
  }

  async getPaymentBilling({
    customerId,
    returnUrl,
  }: {
    customerId: string;
    returnUrl?: string;
  }): Promise<PaymentBilling> {
    try {
      const billing = await this.client.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });

      if (!billing.url) {
        throw new Error('get billing url failed');
      }

      return {
        billingUrl: billing.url,
      };
    } catch (error) {
      throw error;
    }
  }

  async cancelSubscription({
    subscriptionId,
  }: {
    subscriptionId: string;
  }): Promise<PaymentSession> {
    try {
      if (!subscriptionId) {
        throw new Error('subscriptionId is required');
      }

      const subscription =
        await this.client.subscriptions.cancel(subscriptionId);

      if (!subscription.canceled_at) {
        throw new Error('Cancel subscription failed');
      }

      return await this.buildPaymentSessionFromSubscription(subscription);
    } catch (error) {
      throw error;
    }
  }

  mapStripeEventType(eventType: string): PaymentEventType | null {
    switch (eventType) {
      case 'checkout.session.completed':
        return PaymentEventType.CHECKOUT_SUCCESS;
      case 'invoice.payment_succeeded':
        return PaymentEventType.PAYMENT_SUCCESS;
      case 'invoice.payment_failed':
        return PaymentEventType.PAYMENT_FAILED;
      case 'customer.subscription.updated':
        return PaymentEventType.SUBSCRIBE_UPDATED;
      case 'customer.subscription.deleted':
        return PaymentEventType.SUBSCRIBE_CANCELED;
      case 'charge.refunded':
        return PaymentEventType.PAYMENT_REFUNDED;
      default:
        return null;
    }
  }

  private mapStripeStatus(
    session: Stripe.Response<Stripe.Checkout.Session>
  ): PaymentStatus {
    switch (session.status) {
      case 'complete':
        // session complete, check payment status
        switch (session.payment_status) {
          case 'paid':
            // payment success
            return PaymentStatus.SUCCESS;
          case 'unpaid':
            // payment failed
            return PaymentStatus.PROCESSING;
          case 'no_payment_required':
            // means payment not required, should be success
            return PaymentStatus.SUCCESS;
          default:
            throw new Error(
              `Unknown Stripe payment status: ${session.payment_status}`
            );
        }
      case 'expired':
        // payment canceled
        return PaymentStatus.CANCELED;
      case 'open':
        return PaymentStatus.PROCESSING;
      default:
        throw new Error(`Unknown Stripe status: ${session.status}`);
    }
  }

  // build payment session from checkout session
  private async buildPaymentSessionFromCheckoutSession(
    session: Stripe.Response<Stripe.Checkout.Session>
  ): Promise<PaymentSession> {
    let subscription: Stripe.Response<Stripe.Subscription> | undefined =
      undefined;
    let billingUrl = '';

    if (session.subscription) {
      subscription = await this.client.subscriptions.retrieve(
        session.subscription as string
      );
    }

    const result: PaymentSession = {
      provider: this.name,
      paymentStatus: this.mapStripeStatus(session),
      paymentInfo: {
        transactionId: session.id,
        discountCode: session.discounts?.find(
          (discount) => discount.promotion_code
        )?.promotion_code as string,
        discountAmount: session.total_details?.amount_discount || 0,
        discountCurrency: session.currency || '',
        paymentAmount: session.amount_total || 0,
        paymentCurrency: session.currency || '',
        paymentEmail:
          session.customer_email ||
          session.customer_details?.email ||
          undefined,
        paymentUserName: session.customer_details?.name || '',
        paymentUserId: session.customer
          ? (session.customer as string)
          : undefined,
        paidAt: session.created ? new Date(session.created * 1000) : undefined,
        invoiceId: session.invoice ? (session.invoice as string) : undefined,
        invoiceUrl: '',
      },
      paymentResult: session,
      metadata: session.metadata,
    };

    if (subscription) {
      result.subscriptionId = subscription.id;
      result.subscriptionInfo = await this.buildSubscriptionInfo(subscription);
      result.subscriptionResult = subscription;
    }

    return result;
  }

  // build payment session from invoice
  private async buildPaymentSessionFromInvoice(
    invoice: Stripe.Response<Stripe.Invoice>
  ): Promise<PaymentSession> {
    let subscription: Stripe.Response<Stripe.Subscription> | undefined =
      undefined;
    let billingUrl = '';

    if (invoice.lines.data.length > 0) {
      const data = invoice.lines.data[0];
      let subscriptionId = '';

      // get subscription id from invoice line data
      if (data.subscription) {
        subscriptionId = data.subscription as string;
      } else if (
        data.parent &&
        data.parent.subscription_item_details &&
        data.parent.subscription_item_details.subscription
      ) {
        subscriptionId = data.parent.subscription_item_details
          .subscription as string;
      }

      if (subscriptionId) {
        subscription = await this.client.subscriptions.retrieve(subscriptionId);
      }
    }

    // Derive payment status from invoice.status so the same builder
    // works for both invoice.payment_succeeded and invoice.payment_failed
    // events. 'paid' → SUCCESS; 'open' / 'uncollectible' / 'void' → FAILED;
    // anything else → PROCESSING (treated as in-flight by callers).
    const paymentStatus: PaymentStatus =
      invoice.status === 'paid'
        ? PaymentStatus.SUCCESS
        : invoice.status === 'open' ||
            invoice.status === 'uncollectible' ||
            invoice.status === 'void'
          ? PaymentStatus.FAILED
          : PaymentStatus.PROCESSING;

    const result: PaymentSession = {
      provider: this.name,

      paymentStatus,
      paymentInfo: {
        transactionId: invoice.id,
        discountCode: '',
        discountAmount: invoice.total_discount_amounts?.[0]?.amount ?? 0,
        discountCurrency: invoice.currency || '',
        paymentAmount: invoice.amount_paid,
        paymentCurrency: invoice.currency,
        paymentEmail: invoice.customer_email || '',
        paymentUserName: invoice.customer_name || '',
        paymentUserId: invoice.customer
          ? (invoice.customer as string)
          : undefined,
        paidAt: invoice.created ? new Date(invoice.created * 1000) : undefined,
        invoiceId: invoice.id,
        invoiceUrl: invoice.hosted_invoice_url || '',
        subscriptionCycleType:
          invoice.billing_reason === 'subscription_create'
            ? SubscriptionCycleType.CREATE
            : invoice.billing_reason === 'subscription_cycle'
              ? SubscriptionCycleType.RENEWAL
              : undefined,
      },
      paymentResult: invoice,
      metadata: invoice.metadata,
    };

    if (subscription) {
      result.subscriptionId = subscription.id;
      result.subscriptionInfo = await this.buildSubscriptionInfo(subscription);
      result.subscriptionResult = subscription;
    }

    return result;
  }

  // build payment session from invoice
  private async buildPaymentSessionFromSubscription(
    subscription: Stripe.Response<Stripe.Subscription>
  ): Promise<PaymentSession> {
    const result: PaymentSession = {
      provider: this.name,
    };

    if (subscription) {
      result.subscriptionId = subscription.id;
      result.subscriptionInfo = await this.buildSubscriptionInfo(subscription);
      result.subscriptionResult = subscription;
    }

    return result;
  }

  private async buildPaymentSessionFromCharge(
    charge: Stripe.Charge
  ): Promise<PaymentSession> {
    // Refund pipeline. order_no can live in 3 sources depending on whether
    // the charge is one-time, first-invoice subscription, or renewal. Stripe
    // API 2025-11-17.clover stopped including `invoice` on the charge.refunded
    // webhook payload, so we re-fetch the charge with `invoice.subscription`
    // and `payment_intent` expanded to recover all metadata in one round-trip.
    let orderNoFromPi: string | undefined;
    let invoiceId: string | undefined;
    let subscriptionId: string | undefined;
    let orderNoFromSub: string | undefined;

    const fullCharge = (await this.client.charges.retrieve(charge.id, {
      expand: ['payment_intent', 'invoice.subscription'],
    })) as Stripe.Response<Stripe.Charge> & {
      invoice?: string | (Stripe.Invoice & {
        subscription?: string | Stripe.Subscription | null;
      }) | null;
      payment_intent?: string | Stripe.PaymentIntent | null;
    };

    // Path 1: charge.metadata (rare for subscription, common for one-time)
    if (fullCharge.metadata?.order_no) {
      orderNoFromPi = fullCharge.metadata.order_no;
    }

    // Path 2: payment_intent.metadata.order_no (set in checkout for one-time
    // via payment_intent_data.metadata; subscription mode uses
    // subscription_data.metadata instead, so this is the one-time path)
    if (!orderNoFromPi && fullCharge.payment_intent) {
      const pi =
        typeof fullCharge.payment_intent === 'object'
          ? fullCharge.payment_intent
          : null;
      if (pi?.metadata?.order_no) {
        orderNoFromPi = pi.metadata.order_no;
      }
    }

    // Path 3: invoice -> subscription. invoice.id is the canonical key for
    // renewal orders (renewal handler stores invoice.id in
    // order.transaction_id). subscription.metadata.order_no points at the
    // FIRST order, so it's the fallback for first-invoice subscription refund.
    const invoiceObj =
      typeof fullCharge.invoice === 'object' ? fullCharge.invoice : null;
    if (invoiceObj) {
      invoiceId = invoiceObj.id;
      const subObj =
        typeof invoiceObj.subscription === 'object'
          ? invoiceObj.subscription
          : null;
      if (subObj) {
        subscriptionId = subObj.id;
        orderNoFromSub = subObj.metadata?.order_no || undefined;
      } else if (typeof invoiceObj.subscription === 'string') {
        subscriptionId = invoiceObj.subscription;
      }
    }

    // Path 5: PaymentIntent -> invoicePayments to recover invoice.id. Stripe
    // API 2025-08-27.basil dropped `invoice` from Charge and PaymentIntent;
    // invoicePayments is the documented mapping from PI to Invoice. The
    // resulting invoice.id is the canonical key for renewal refunds via the
    // webhook route's findOrderByTransactionId path. limit=2 lets us detect
    // ambiguity; only an unambiguous single match is safe to bind.
    if (!invoiceId && fullCharge.payment_intent) {
      const piId =
        typeof fullCharge.payment_intent === 'string'
          ? fullCharge.payment_intent
          : fullCharge.payment_intent.id;
      try {
        const invPayments = await this.client.invoicePayments.list({
          payment: { type: 'payment_intent', payment_intent: piId },
          status: 'paid',
          limit: 2,
        });
        if (invPayments.data.length === 1) {
          const ip = invPayments.data[0] as Stripe.InvoicePayment & {
            invoice?: string | Stripe.Invoice;
          };
          if (typeof ip.invoice === 'string') {
            invoiceId = ip.invoice;
          } else if (ip.invoice?.id) {
            invoiceId = ip.invoice.id;
          }
        }
      } catch {
        // invoicePayments unavailable in older API/SDK — silently fall through
      }
    }

    // Path 4: customer -> subscriptions. ONLY runs when we already have an
    // invoice link (= this charge belongs to a subscription). Without that
    // guard, a legacy one-time charge from a customer who later subscribed
    // would falsely bind to an unrelated subscription's order_no.
    //
    // For renewal refunds the webhook route prefers `invoice_id` (set above)
    // over `order_no_from_sub` (set here), so wrong-order binding does not
    // occur. Path 4 surfaces order_no_from_sub for first-charge subscription
    // refunds where invoice_id won't match any local renewal order
    // (first-charge orders store checkout_session.id in transaction_id, not
    // invoice.id).
    if (
      !orderNoFromPi &&
      !orderNoFromSub &&
      invoiceId &&
      fullCharge.customer
    ) {
      const customerId =
        typeof fullCharge.customer === 'string'
          ? fullCharge.customer
          : fullCharge.customer.id;
      const subs = await this.client.subscriptions.list({
        customer: customerId,
        status: 'all',
        limit: 5,
      });
      for (const sub of subs.data) {
        if (sub.metadata?.order_no) {
          orderNoFromSub = sub.metadata.order_no;
          if (!subscriptionId) subscriptionId = sub.id;
          break;
        }
      }
    }

    return {
      provider: this.name,
      paymentStatus: PaymentStatus.REFUNDED,
      paymentInfo: {
        transactionId: charge.id,
        paymentAmount: charge.amount_refunded,
        paymentCurrency: charge.currency,
        paymentEmail: charge.billing_details?.email || '',
        paymentUserName: charge.billing_details?.name || '',
        paymentUserId:
          typeof charge.customer === 'string'
            ? charge.customer
            : charge.customer?.id,
      },
      paymentResult: charge,
      metadata: {
        order_no_from_pi: orderNoFromPi,
        invoice_id: invoiceId,
        subscription_id: subscriptionId,
        order_no_from_sub: orderNoFromSub,
        // Surface refund completeness so the webhook route can detect partial refund
        charge_amount: charge.amount,
        charge_amount_refunded: charge.amount_refunded,
      },
    };
  }

  // build subscription info from subscription
  private async buildSubscriptionInfo(
    subscription: Stripe.Response<Stripe.Subscription>
  ): Promise<SubscriptionInfo> {
    // subscription data
    const data = subscription.items.data[0];

    const subscriptionInfo: SubscriptionInfo = {
      subscriptionId: subscription.id,
      productId: data.price.product as string,
      planId: data.price.id,
      description: '',
      amount: data.price.unit_amount || 0,
      currency: data.price.currency,
      currentPeriodStart: new Date(data.current_period_start * 1000),
      currentPeriodEnd: new Date(data.current_period_end * 1000),
      interval: data.plan.interval as PaymentInterval,
      intervalCount: data.plan.interval_count || 1,
      metadata: subscription.metadata,
    };

    switch (subscription.status) {
      case 'active':
        if (subscription.cancel_at) {
          subscriptionInfo.status = SubscriptionStatus.PENDING_CANCEL;
          // cancel apply at
          subscriptionInfo.canceledAt = new Date(
            (subscription.canceled_at || 0) * 1000
          );
          // cancel end date
          subscriptionInfo.canceledEndAt = new Date(
            subscription.cancel_at * 1000
          );
          subscriptionInfo.canceledReason =
            subscription.cancellation_details?.comment || '';
          subscriptionInfo.canceledReasonType =
            subscription.cancellation_details?.feedback || '';
        } else {
          subscriptionInfo.status = SubscriptionStatus.ACTIVE;
        }
        break;
      case 'trialing':
        subscriptionInfo.status = SubscriptionStatus.TRIALING;
        break;
      case 'canceled':
        // subscription canceled
        subscriptionInfo.status = SubscriptionStatus.CANCELED;
        subscriptionInfo.canceledAt = new Date(
          (subscription.canceled_at || 0) * 1000
        );
        subscriptionInfo.canceledReason =
          subscription.cancellation_details?.comment || '';
        subscriptionInfo.canceledReasonType =
          subscription.cancellation_details?.feedback || '';
        break;
      case 'past_due':
        subscriptionInfo.status = SubscriptionStatus.PAST_DUE;
        break;
      case 'unpaid':
        subscriptionInfo.status = SubscriptionStatus.UNPAID;
        break;
      case 'incomplete':
        subscriptionInfo.status = SubscriptionStatus.INCOMPLETE;
        break;
      case 'incomplete_expired':
        subscriptionInfo.status = SubscriptionStatus.INCOMPLETE_EXPIRED;
        break;
      case 'paused':
        subscriptionInfo.status = SubscriptionStatus.PAUSED;
        break;
      default:
        throw new Error(
          `Unknown Stripe subscription status: ${subscription.status}`
        );
    }

    return subscriptionInfo;
  }
}

/**
 * Create Stripe provider with configs
 */
export function createStripeProvider(configs: StripeConfigs): StripeProvider {
  return new StripeProvider(configs);
}
