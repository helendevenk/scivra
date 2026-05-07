import { and, count, desc, eq, sql } from 'drizzle-orm';

import { db } from '@/core/db';
import { credit, order, subscription } from '@/config/db/schema';
import { PaymentType } from '@/extensions/payment/types';

import { NewCredit } from './credit';
import {
  NewSubscription,
  UpdateSubscription,
  updateSubscriptionBySubscriptionNo,
} from './subscription';
import { appendUserToResult, User } from './user';

export type Order = typeof order.$inferSelect & {
  user?: User;
};
export type NewOrder = typeof order.$inferInsert;
export type UpdateOrder = Partial<
  Omit<NewOrder, 'id' | 'orderNo' | 'createdAt'>
>;

export enum OrderStatus {
  // processing status
  PENDING = 'pending', // order saved, waiting for checkout
  CREATED = 'created', // checkout success
  // final status
  COMPLETED = 'completed', // checkout completed, but failed
  PAID = 'paid', // order paid success
  FAILED = 'failed', // order paid, but failed
}

/**
 * create order
 */
export async function createOrder(newOrder: NewOrder) {
  const [result] = await db().insert(order).values(newOrder).returning();

  return result;
}

/**
 * get orders
 */
export async function getOrders({
  orderNo,
  userId,
  status,
  getUser,
  paymentType,
  paymentProvider,
  page = 1,
  limit = 30,
}: {
  orderNo?: string;
  userId?: string;
  status?: OrderStatus;
  getUser?: boolean;
  paymentType?: PaymentType;
  paymentProvider?: string;
  page?: number;
  limit?: number;
} = {}): Promise<Order[]> {
  const result = await db()
    .select()
    .from(order)
    .where(
      and(
        orderNo ? eq(order.orderNo, orderNo) : undefined,
        userId ? eq(order.userId, userId) : undefined,
        status ? eq(order.status, status) : undefined,
        paymentType ? eq(order.paymentType, paymentType) : undefined,
        paymentProvider ? eq(order.paymentProvider, paymentProvider) : undefined
      )
    )
    .orderBy(desc(order.createdAt))
    .limit(limit)
    .offset((page - 1) * limit);

  if (getUser) {
    return appendUserToResult(result);
  }

  return result;
}

/**
 * get orders count
 */
export async function getOrdersCount({
  orderNo,
  userId,
  paymentType,
  status,
  paymentProvider,
}: {
  orderNo?: string;
  userId?: string;
  paymentType?: PaymentType;
  paymentProvider?: string;
  status?: OrderStatus;
} = {}): Promise<number> {
  const [result] = await db()
    .select({ count: count() })
    .from(order)
    .where(
      and(
        orderNo ? eq(order.orderNo, orderNo) : undefined,
        userId ? eq(order.userId, userId) : undefined,
        status ? eq(order.status, status) : undefined,
        paymentType ? eq(order.paymentType, paymentType) : undefined,
        paymentProvider ? eq(order.paymentProvider, paymentProvider) : undefined
      )
    );

  return result?.count || 0;
}

/**
 * find order by id
 */
export async function findOrderById(id: string) {
  const [result] = await db().select().from(order).where(eq(order.id, id));

  return result;
}

/**
 * find order by order no
 */
export async function findOrderByOrderNo(orderNo: string) {
  const [result] = await db()
    .select()
    .from(order)
    .where(eq(order.orderNo, orderNo));

  return result;
}

/**
 * update order
 */
export async function updateOrderByOrderNo(
  orderNo: string,
  updateOrder: UpdateOrder
) {
  const [result] = await db()
    .update(order)
    .set(updateOrder)
    .where(eq(order.orderNo, orderNo))
    .returning();

  return result;
}

/**
 * update order by order id
 */
export async function updateOrderByOrderId(
  orderId: string,
  updateOrder: UpdateOrder
) {
  const [result] = await db()
    .update(order)
    .set(updateOrder)
    .where(eq(order.id, orderId))
    .returning();

  return result;
}

export async function updateOrderInTransaction({
  orderNo,
  updateOrder,
  newSubscription,
  newCredit,
}: {
  orderNo: string;
  updateOrder: UpdateOrder;
  newSubscription?: NewSubscription;
  newCredit?: NewCredit;
}) {
  if (!orderNo || !updateOrder) {
    throw new Error('orderNo and updateOrder are required');
  }

  // only update order, no need transaction
  if (!newSubscription && !newCredit) {
    return updateOrderByOrderNo(orderNo, updateOrder);
  }

  // need transaction
  const result = await db().transaction(async (tx) => {
    let result: any = {
      order: null,
      subscription: null,
      credit: null,
    };

    // Subscription dedup: rely on UNIQUE(payment_provider, subscription_id)
    // to make insert atomic across concurrent webhook + callback paths.
    // After resolving the canonical row, rewrite caller-held references
    // (updateOrder.subscriptionNo, newCredit.subscriptionNo) so order and
    // credit never end up pointing at a losing-tx ghost row.
    if (newSubscription) {
      const [inserted] = await tx
        .insert(subscription)
        .values(newSubscription)
        .onConflictDoNothing({
          target: [subscription.paymentProvider, subscription.subscriptionId],
        })
        .returning();

      let canonical = inserted;
      if (!canonical) {
        const [existing] = await tx
          .select()
          .from(subscription)
          .where(
            and(
              eq(subscription.subscriptionId, newSubscription.subscriptionId),
              eq(subscription.paymentProvider, newSubscription.paymentProvider)
            )
          );
        if (!existing) {
          // Fail-closed: onConflict fired but no row found = invariant
          // break. Throwing makes Stripe retry the webhook.
          throw new Error(
            `subscription canonical row missing after conflict ` +
              `(provider=${newSubscription.paymentProvider}, ` +
              `subscriptionId=${newSubscription.subscriptionId})`
          );
        }
        canonical = existing;
      }

      result.subscription = canonical;

      if (canonical.subscriptionNo !== newSubscription.subscriptionNo) {
        updateOrder.subscriptionNo = canonical.subscriptionNo;
        if (newCredit) {
          newCredit.subscriptionNo = canonical.subscriptionNo;
        }
      }
    }

    // Credit dedup: partial UNIQUE on (order_no, transaction_type) where
    // order_no IS NOT NULL AND transaction_type = 'grant'. GIFT / REFUND
    // grants (orderNo NULL) and consume rows are unaffected.
    if (newCredit) {
      const [inserted] = await tx
        .insert(credit)
        .values(newCredit)
        .onConflictDoNothing({
          target: [credit.orderNo, credit.transactionType],
          where: sql`${credit.orderNo} IS NOT NULL AND ${credit.transactionType} = 'grant'`,
        })
        .returning();

      if (inserted) {
        result.credit = inserted;
      } else {
        const [existing] = await tx
          .select()
          .from(credit)
          .where(
            and(
              eq(credit.orderNo, newCredit.orderNo!),
              eq(credit.transactionType, newCredit.transactionType)
            )
          );
        if (!existing) {
          throw new Error(
            `credit canonical row missing after conflict ` +
              `(orderNo=${newCredit.orderNo})`
          );
        }
        result.credit = existing;
      }
    }

    // update order
    const [orderResult] = await tx
      .update(order)
      .set(updateOrder)
      .where(eq(order.orderNo, orderNo))
      .returning();

    result.order = orderResult;

    return result;
  });

  return result;
}

export async function updateSubscriptionInTransaction({
  subscriptionNo,
  updateSubscription,
  newOrder,
  newCredit,
}: {
  subscriptionNo: string; // subscription unique id in table
  updateSubscription: UpdateSubscription;
  newOrder?: NewOrder;
  newCredit?: NewCredit;
}) {
  if (!subscriptionNo || !updateSubscription) {
    throw new Error('subscriptionNo and updateSubscription are required');
  }

  // only update order, no need transaction
  if (!newOrder && !newCredit) {
    return updateSubscriptionBySubscriptionNo(
      subscriptionNo,
      updateSubscription
    );
  }

  // need transaction
  const result = await db().transaction(async (tx) => {
    let result: any = {
      order: null,
      subscription: null,
      credit: null,
    };

    // Order dedup for renewal: UNIQUE(payment_provider, transaction_id).
    // Pending orders without transaction_id can't use the constraint
    // (PG UNIQUE allows multiple NULLs), so they fall back to plain
    // insert relying on order_no's own unique.
    if (newOrder) {
      let canonical: typeof order.$inferSelect | undefined;

      if (newOrder.transactionId && newOrder.paymentProvider) {
        const [inserted] = await tx
          .insert(order)
          .values(newOrder)
          .onConflictDoNothing({
            target: [order.paymentProvider, order.transactionId],
          })
          .returning();

        if (inserted) {
          canonical = inserted;
        } else {
          const [existing] = await tx
            .select()
            .from(order)
            .where(
              and(
                eq(order.transactionId, newOrder.transactionId),
                eq(order.paymentProvider, newOrder.paymentProvider)
              )
            );
          if (!existing) {
            throw new Error(
              `order canonical row missing after conflict ` +
                `(provider=${newOrder.paymentProvider}, ` +
                `transactionId=${newOrder.transactionId})`
            );
          }
          canonical = existing;
        }
      } else {
        const [inserted] = await tx
          .insert(order)
          .values(newOrder)
          .returning();
        canonical = inserted;
      }

      result.order = canonical;

      // Rewrite caller-held order_no on newCredit so credit doesn't
      // point at the losing-tx's order row after a race.
      if (
        newCredit &&
        canonical &&
        canonical.orderNo !== newOrder.orderNo
      ) {
        newCredit.orderNo = canonical.orderNo;
      }
    }

    // Credit dedup: same partial UNIQUE as updateOrderInTransaction.
    if (newCredit) {
      const [inserted] = await tx
        .insert(credit)
        .values(newCredit)
        .onConflictDoNothing({
          target: [credit.orderNo, credit.transactionType],
          where: sql`${credit.orderNo} IS NOT NULL AND ${credit.transactionType} = 'grant'`,
        })
        .returning();

      if (inserted) {
        result.credit = inserted;
      } else {
        const [existing] = await tx
          .select()
          .from(credit)
          .where(
            and(
              eq(credit.orderNo, newCredit.orderNo!),
              eq(credit.transactionType, newCredit.transactionType)
            )
          );
        if (!existing) {
          throw new Error(
            `credit canonical row missing after conflict ` +
              `(orderNo=${newCredit.orderNo})`
          );
        }
        result.credit = existing;
      }
    }

    // update subscription
    const [subscriptionResult] = await tx
      .update(subscription)
      .set(updateSubscription)
      .where(eq(subscription.subscriptionNo, subscriptionNo))
      .returning();

    result.subscription = subscriptionResult;

    return result;
  });

  return result;
}
