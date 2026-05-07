import {
  PaymentEventType,
  PaymentSignatureError,
  SubscriptionCycleType,
} from '@/extensions/payment/types';
import type {
  PaymentEvent,
  PaymentSession,
} from '@/extensions/payment/types';
import {
  findOrderByOrderNo,
  OrderStatus,
  updateOrderByOrderNo,
} from '@/shared/models/order';
import { findSubscriptionByProviderSubscriptionId } from '@/shared/models/subscription';
import {
  getPaymentService,
  handleCheckoutSuccess,
  handleSubscriptionCanceled,
  handleSubscriptionPaymentFailed,
  handleSubscriptionRenewal,
  handleSubscriptionUpdated,
} from '@/shared/services/payment';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ provider: string }> }
) {
  let provider: string | undefined;
  let event: PaymentEvent | null | undefined;
  let session: PaymentSession | undefined;

  try {
    ({ provider } = await params);

    if (!provider) {
      throw new Error('provider is required');
    }

    const paymentService = await getPaymentService();
    const paymentProvider = paymentService.getProvider(provider);
    if (!paymentProvider) {
      throw new Error('payment provider not found');
    }

    // get payment event from webhook notification
    event = await paymentProvider.getPaymentEvent({ req });
    if (event === null) {
      return Response.json({ code: 0, message: 'ignored' });
    }

    const eventType = event.eventType;
    if (!eventType) {
      throw new Error('event type not found');
    }

    // payment session
    session = event.paymentSession;
    if (!session) {
      throw new Error('payment session not found');
    }

    // console.log('notify payment session', session);

    if (eventType === PaymentEventType.CHECKOUT_SUCCESS) {
      // one-time payment or subscription first payment
      const orderNo = session.metadata.order_no;

      if (!orderNo) {
        throw new Error('order no not found');
      }

      const order = await findOrderByOrderNo(orderNo);
      if (!order) {
        throw new Error('order not found');
      }

      await handleCheckoutSuccess({
        order,
        session,
      });
    } else if (eventType === PaymentEventType.PAYMENT_SUCCESS) {
      // only handle subscription payment
      if (session.subscriptionId && session.subscriptionInfo) {
        if (
          session.paymentInfo?.subscriptionCycleType ===
          SubscriptionCycleType.RENEWAL
        ) {
          // only handle subscription renewal payment
          const existingSubscription =
            await findSubscriptionByProviderSubscriptionId({
              provider: provider,
              subscriptionId: session.subscriptionId,
            });
          if (!existingSubscription) {
            throw new Error('subscription not found');
          }

          // handle subscription renewal payment
          await handleSubscriptionRenewal({
            subscription: existingSubscription,
            session,
          });
        } else {
          console.log('not handle subscription first payment');
        }
      } else {
        console.log('not handle one-time payment');
      }
    } else if (eventType === PaymentEventType.SUBSCRIBE_UPDATED) {
      // only handle subscription update
      if (!session.subscriptionId || !session.subscriptionInfo) {
        throw new Error('subscription id or subscription info not found');
      }

      const existingSubscription =
        await findSubscriptionByProviderSubscriptionId({
          provider: provider,
          subscriptionId: session.subscriptionId,
        });
      if (!existingSubscription) {
        throw new Error('subscription not found');
      }

      await handleSubscriptionUpdated({
        subscription: existingSubscription,
        session,
      });
    } else if (eventType === PaymentEventType.SUBSCRIBE_CANCELED) {
      // only handle subscription cancellation
      if (!session.subscriptionId || !session.subscriptionInfo) {
        throw new Error('subscription id or subscription info not found');
      }

      const existingSubscription =
        await findSubscriptionByProviderSubscriptionId({
          provider: provider,
          subscriptionId: session.subscriptionId,
        });
      if (!existingSubscription) {
        throw new Error('subscription not found');
      }

      await handleSubscriptionCanceled({
        subscription: existingSubscription,
        session,
      });
    } else if (eventType === PaymentEventType.PAYMENT_FAILED) {
      if (session.subscriptionId) {
        const existingSubscription =
          await findSubscriptionByProviderSubscriptionId({
            provider: provider,
            subscriptionId: session.subscriptionId,
          });
        if (!existingSubscription) {
          console.log('payment_failed for unknown subscription, skipping');
        } else {
          await handleSubscriptionPaymentFailed({
            subscription: existingSubscription,
            session,
          });
        }
      } else if (session.metadata?.order_no) {
        const orderNo = session.metadata.order_no;
        const order = await findOrderByOrderNo(orderNo);
        if (order) {
          await updateOrderByOrderNo(order.orderNo, {
            status: OrderStatus.FAILED,
            paymentResult: JSON.stringify(session.paymentResult),
          });
        }
      }
    } else {
      console.log('not handle other event type: ' + eventType);
    }

    // Webhook response: providers (Stripe/PayPal/Creem) expect 200 with any JSON body
    return Response.json({ code: 0, message: 'success' });
  } catch (err: unknown) {
    // Signature verification failed: client error, Stripe should not retry.
    if (err instanceof PaymentSignatureError) {
      console.error('webhook signature verification failed', err);
      return Response.json(
        { code: -1, message: 'invalid signature' },
        { status: 400 }
      );
    }

    // Business or unknown errors: server error, let Stripe retry.
    // Idempotency is enforced at the DB layer with UNIQUE constraints and
    // onConflictDoNothing in updateOrderInTransaction.
    console.error('handle payment notify failed', err);

    const context: Record<string, unknown> = {
      provider,
      eventType:
        event?.eventType ?? (err instanceof Error ? err.name : 'unknown'),
      orderNo: session?.metadata?.order_no,
      subscriptionId: session?.subscriptionId,
    };

    try {
      type SentryModule = {
        captureException?: (
          exception: unknown,
          context?: { extra?: Record<string, unknown> }
        ) => void;
      };

      const sentryModuleName = '@sentry/nextjs';
      const Sentry = (await import(sentryModuleName).catch(
        () => null
      )) as SentryModule | null;
      if (Sentry && typeof Sentry.captureException === 'function') {
        Sentry.captureException(err, { extra: context });
      }
    } catch {
      // Sentry import failed, already logged above.
    }

    return Response.json(
      { code: -1, message: 'internal error' },
      { status: 500 }
    );
  }
}
