import { vi, describe, it, expect, beforeEach } from 'vitest';

// Mock external deps BEFORE importing the model
vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/models/user', () => ({
  appendUserToResult: vi.fn((result: unknown[]) => result),
}));

vi.mock('@/shared/models/subscription', () => ({
  updateSubscriptionBySubscriptionNo: vi.fn(),
}));

vi.mock('@/shared/models/credit', () => ({
  // Only the type imports are used, no runtime functions needed here
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  createOrder,
  findOrderById,
  findOrderByOrderNo,
  updateOrderByOrderNo,
  updateOrderByOrderId,
  getOrders,
  getOrdersCount,
  updateOrderInTransaction,
  updateSubscriptionInTransaction,
  OrderStatus,
} from '@/shared/models/order';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

describe('createOrder', () => {
  it('inserts and returns order record', async () => {
    const newOrder = { id: 'o1', orderNo: 'ON-001', userId: 'u1' };
    const expected = { ...newOrder, status: OrderStatus.PENDING };
    mockDb._resolveInsert([expected]);

    const result = await createOrder(newOrder as any);

    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.values).toHaveBeenCalledWith(newOrder);
    expect(result).toEqual(expected);
  });
});

describe('findOrderById', () => {
  it('returns order by ID', async () => {
    const order = { id: 'o1', orderNo: 'ON-001' };
    mockDb._resolveSelect([order]);

    const result = await findOrderById('o1');

    expect(mockDb.select).toHaveBeenCalled();
    expect(mockDb.from).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(order);
  });
});

describe('findOrderByOrderNo', () => {
  it('returns order by orderNo', async () => {
    const order = { id: 'o1', orderNo: 'ON-001' };
    mockDb._resolveSelect([order]);

    const result = await findOrderByOrderNo('ON-001');

    expect(result).toEqual(order);
  });

  it('returns undefined for unknown orderNo', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await findOrderByOrderNo('NONEXISTENT');

    expect(result).toBeUndefined();
  });
});

describe('updateOrderByOrderNo', () => {
  it('updates specified fields and returns result', async () => {
    const updated = { id: 'o1', orderNo: 'ON-001', status: OrderStatus.PAID };
    mockDb._resolveInsert([updated]); // returning() uses insertResult

    const result = await updateOrderByOrderNo('ON-001', {
      status: OrderStatus.PAID,
    } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(mockDb.set).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });
});

describe('updateOrderByOrderId', () => {
  it('updates by ID and returns result', async () => {
    const updated = { id: 'o1', status: OrderStatus.COMPLETED };
    mockDb._resolveInsert([updated]);

    const result = await updateOrderByOrderId('o1', {
      status: OrderStatus.COMPLETED,
    } as any);

    expect(mockDb.update).toHaveBeenCalled();
    expect(result).toEqual(updated);
  });
});

describe('getOrders', () => {
  it('paginates correctly', async () => {
    const orders = [{ id: 'o1' }, { id: 'o2' }];
    mockDb._resolveSelect(orders);

    const result = await getOrders({ userId: 'u1', page: 3, limit: 5 });

    expect(mockDb.limit).toHaveBeenCalledWith(5);
    expect(mockDb.offset).toHaveBeenCalledWith(10); // (3-1)*5
    expect(result).toEqual(orders);
  });
});

describe('getOrdersCount', () => {
  it('returns count', async () => {
    mockDb._resolveSelect([{ count: 17 }]);

    const result = await getOrdersCount({ userId: 'u1' });

    expect(result).toBe(17);
  });

  it('returns 0 when no result', async () => {
    mockDb._resolveSelect([undefined]);

    const result = await getOrdersCount({});

    expect(result).toBe(0);
  });
});

describe('updateOrderInTransaction', () => {
  it('commits transaction with subscription and credit', async () => {
    // transaction mock runs the callback with chain as tx
    mockDb._resolveSelect([undefined]); // no existing subscription/credit
    mockDb._resolveInsert([{ id: 'sub1', subscriptionId: 'sid' }]);

    const result = await updateOrderInTransaction({
      orderNo: 'ON-001',
      updateOrder: { status: OrderStatus.PAID } as any,
      newSubscription: {
        subscriptionId: 'sid',
        paymentProvider: 'stripe',
      } as any,
      newCredit: { orderNo: 'ON-001', credits: 100 } as any,
    });

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(result).toBeDefined();
  });

  it('throws when orderNo or updateOrder missing', async () => {
    await expect(
      updateOrderInTransaction({
        orderNo: '',
        updateOrder: { status: OrderStatus.PAID } as any,
      })
    ).rejects.toThrow('orderNo and updateOrder are required');
  });
});

describe('updateSubscriptionInTransaction', () => {
  it('commits transaction with order and credit', async () => {
    mockDb._resolveSelect([undefined]); // no existing order/credit
    mockDb._resolveInsert([{ id: 'order1', orderNo: 'ON-002', transactionId: 'tid' }]);

    const result = await updateSubscriptionInTransaction({
      subscriptionNo: 'SN-001',
      updateSubscription: { status: 'active' } as any,
      newOrder: {
        transactionId: 'tid',
        paymentProvider: 'stripe',
      } as any,
      newCredit: { credits: 50 } as any,
    });

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(result).toBeDefined();
  });
});
