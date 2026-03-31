import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({
  db: vi.fn(),
}));

vi.mock('@/shared/lib/hash', () => ({
  getUuid: vi.fn(() => 'mock-uuid'),
}));

vi.mock('@/shared/models/subscription', () => ({
  getCurrentSubscription: vi.fn(),
}));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import { getCurrentSubscription } from '@/shared/models/subscription';
import {
  getAdminLearningPaths,
  findLearningPathById,
  createLearningPath,
  updateLearningPath,
  deleteLearningPath,
  getNodesByPathId,
  createNode,
  updateNode,
  deleteNode,
  getPublishedPaths,
  findPublishedPathBySlug,
  getUserProgressForPath,
  getUserProgressForPaths,
  upsertProgress,
  getMaxOrderIndex,
  getNodeByPathAndOrder,
  findLearningPathBySlug,
  getUserCompletedPathCount,
  checkNodeAccess,
  advanceProgress,
  createNodeWithCount,
  deleteNodeWithReorder,
  reorderNodes,
  getOrCreateProgress,
} from '@/shared/models/learning_path';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_PATH = {
  id: 'path-1',
  slug: 'ap-physics-1',
  titleEn: 'AP Physics 1',
  titleZh: 'AP 物理 1',
  descriptionEn: 'Intro to AP Physics',
  descriptionZh: 'AP 物理简介',
  category: 'physics',
  level: 'AP',
  isPublished: true,
  nodeCount: 5,
  createdAt: new Date(),
  updatedAt: new Date(),
};

const MOCK_NODE = {
  id: 'node-1',
  pathId: 'path-1',
  orderIndex: 0,
  titleEn: 'Kinematics',
  titleZh: '运动学',
  descriptionEn: 'Learn about kinematics',
  descriptionZh: '学习运动学',
  quizQuestion: 'What is velocity?',
  experimentSlug: 'projectile-motion',
  createdAt: new Date(),
};

const MOCK_PROGRESS = {
  id: 'prog-1',
  userId: 'user-1',
  pathId: 'path-1',
  currentNode: 2,
  completed: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};

// ─── Learning Path CRUD ───

describe('getAdminLearningPaths', () => {
  it('returns all paths ordered by createdAt desc', async () => {
    mockDb._resolveSelect([MOCK_PATH]);
    const result = await getAdminLearningPaths();
    expect(result).toHaveLength(1);
    expect(mockDb.orderBy).toHaveBeenCalled();
  });
});

describe('findLearningPathById', () => {
  it('returns path when found', async () => {
    mockDb._resolveSelect([MOCK_PATH]);
    const result = await findLearningPathById('path-1');
    expect(result).toEqual(MOCK_PATH);
  });

  it('returns undefined when not found', async () => {
    mockDb._resolveSelect([]);
    const result = await findLearningPathById('nonexistent');
    expect(result).toBeUndefined();
  });
});

describe('createLearningPath', () => {
  it('inserts and returns new path', async () => {
    mockDb._resolveInsert([MOCK_PATH]);
    const result = await createLearningPath(MOCK_PATH as any);
    expect(result).toEqual(MOCK_PATH);
    expect(mockDb.insert).toHaveBeenCalled();
  });
});

describe('updateLearningPath', () => {
  it('updates and returns path', async () => {
    const updated = { ...MOCK_PATH, titleEn: 'Updated' };
    mockDb._resolveInsert([updated]);
    const result = await updateLearningPath('path-1', { titleEn: 'Updated' });
    expect(result.titleEn).toBe('Updated');
  });
});

describe('deleteLearningPath', () => {
  it('calls delete with correct id', async () => {
    await deleteLearningPath('path-1');
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.where).toHaveBeenCalled();
  });
});

// ─── Node CRUD ───

describe('getNodesByPathId', () => {
  it('returns nodes ordered by orderIndex', async () => {
    mockDb._resolveSelect([MOCK_NODE]);
    const result = await getNodesByPathId('path-1');
    expect(result).toHaveLength(1);
    expect(mockDb.orderBy).toHaveBeenCalled();
  });
});

describe('getMaxOrderIndex', () => {
  it('returns max order index', async () => {
    mockDb._resolveSelect([{ maxOrder: 4 }]);
    const result = await getMaxOrderIndex('path-1');
    expect(result).toBe(4);
  });

  it('returns null when no nodes', async () => {
    mockDb._resolveSelect([{ maxOrder: null }]);
    const result = await getMaxOrderIndex('path-1');
    expect(result).toBeNull();
  });
});

describe('createNode', () => {
  it('inserts and returns node', async () => {
    mockDb._resolveInsert([MOCK_NODE]);
    const result = await createNode(MOCK_NODE as any);
    expect(result).toEqual(MOCK_NODE);
  });
});

describe('updateNode', () => {
  it('updates and returns node', async () => {
    const updated = { ...MOCK_NODE, titleEn: 'Updated' };
    mockDb._resolveInsert([updated]);
    const result = await updateNode('node-1', { titleEn: 'Updated' });
    expect(result.titleEn).toBe('Updated');
  });
});

describe('deleteNode', () => {
  it('calls delete with correct id', async () => {
    await deleteNode('node-1');
    expect(mockDb.delete).toHaveBeenCalled();
  });
});

// ─── Public Queries ───

describe('getPublishedPaths', () => {
  it('returns published paths', async () => {
    mockDb._resolveSelect([MOCK_PATH]);
    const result = await getPublishedPaths();
    expect(result).toHaveLength(1);
  });

  it('filters by category', async () => {
    mockDb._resolveSelect([]);
    await getPublishedPaths({ category: 'physics' });
    expect(mockDb.where).toHaveBeenCalled();
  });
});

describe('findPublishedPathBySlug', () => {
  it('returns published path by slug', async () => {
    mockDb._resolveSelect([MOCK_PATH]);
    const result = await findPublishedPathBySlug('ap-physics-1');
    expect(result).toEqual(MOCK_PATH);
  });

  it('returns undefined for unpublished slug', async () => {
    mockDb._resolveSelect([]);
    const result = await findPublishedPathBySlug('unpublished');
    expect(result).toBeUndefined();
  });
});

// ─── Progress ───

describe('getUserProgressForPath', () => {
  it('returns progress when found', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);
    const result = await getUserProgressForPath('user-1', 'path-1');
    expect(result).toEqual(MOCK_PROGRESS);
  });
});

describe('getUserProgressForPaths', () => {
  it('returns empty array for empty pathIds', async () => {
    const result = await getUserProgressForPaths('user-1', []);
    expect(result).toEqual([]);
    expect(mockDb.select).not.toHaveBeenCalled();
  });

  it('returns progress for multiple paths', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);
    const result = await getUserProgressForPaths('user-1', ['path-1']);
    expect(result).toHaveLength(1);
  });
});

describe('upsertProgress', () => {
  it('creates new progress when none exists', async () => {
    mockDb._resolveSelect([]);
    mockDb._resolveInsert([MOCK_PROGRESS]);
    const result = await upsertProgress('user-1', 'path-1', 0, false);
    expect(result).toEqual(MOCK_PROGRESS);
    expect(mockDb.insert).toHaveBeenCalled();
  });

  it('updates existing progress', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);
    const updated = { ...MOCK_PROGRESS, currentNode: 3 };
    mockDb._resolveInsert([updated]);
    const result = await upsertProgress('user-1', 'path-1', 3, false);
    expect(result.currentNode).toBe(3);
    expect(mockDb.update).toHaveBeenCalled();
  });
});

describe('getUserCompletedPathCount', () => {
  it('returns completed count', async () => {
    mockDb._resolveSelect([{ count: 2 }]);
    const result = await getUserCompletedPathCount('user-1');
    expect(result).toBe(2);
  });

  it('returns 0 when none completed', async () => {
    mockDb._resolveSelect([undefined]);
    const result = await getUserCompletedPathCount('user-1');
    expect(result).toBe(0);
  });
});

// ─── Node Queries ───

describe('getNodeByPathAndOrder', () => {
  it('returns node at specific order', async () => {
    mockDb._resolveSelect([MOCK_NODE]);
    const result = await getNodeByPathAndOrder('path-1', 0);
    expect(result).toEqual(MOCK_NODE);
  });
});

describe('findLearningPathBySlug', () => {
  it('returns path by slug (any publish state)', async () => {
    mockDb._resolveSelect([MOCK_PATH]);
    const result = await findLearningPathBySlug('ap-physics-1');
    expect(result).toEqual(MOCK_PATH);
  });
});

// ─── Paywall ───

describe('checkNodeAccess', () => {
  it('allows access to free nodes (index < 3)', async () => {
    const result = await checkNodeAccess(0, null);
    expect(result).toEqual({ allowed: true });
  });

  it('allows access to node index 2 (last free)', async () => {
    const result = await checkNodeAccess(2, null);
    expect(result).toEqual({ allowed: true });
  });

  it('requires login for paid nodes when no user', async () => {
    const result = await checkNodeAccess(3, null);
    expect(result).toEqual({ allowed: false, reason: 'login_required' });
  });

  it('requires subscription for paid nodes when no sub', async () => {
    vi.mocked(getCurrentSubscription).mockResolvedValue(null as any);
    const result = await checkNodeAccess(3, { id: 'user-1' });
    expect(result).toEqual({ allowed: false, reason: 'subscription_required' });
  });

  it('allows access when user has subscription', async () => {
    vi.mocked(getCurrentSubscription).mockResolvedValue({ id: 'sub-1' } as any);
    const result = await checkNodeAccess(5, { id: 'user-1' });
    expect(result).toEqual({ allowed: true });
  });
});

// ─── Advanced Progress ───

describe('advanceProgress', () => {
  it('upserts progress with onConflictDoUpdate', async () => {
    mockDb._resolveInsert([{ ...MOCK_PROGRESS, currentNode: 3 }]);
    const result = await advanceProgress('user-1', 'path-1', 2, 5);
    expect(result.currentNode).toBe(3);
    expect(mockDb.onConflictDoUpdate).toHaveBeenCalled();
  });

  it('sets completed=true when nextNode >= totalNodes', async () => {
    mockDb._resolveInsert([{ ...MOCK_PROGRESS, currentNode: 5, completed: true }]);
    const result = await advanceProgress('user-1', 'path-1', 4, 5);
    expect(result.completed).toBe(true);
  });
});

// ─── Transactional Node Operations ───

describe('createNodeWithCount', () => {
  it('creates node with auto-calculated orderIndex in transaction', async () => {
    // transaction calls callback with the chain (tx = mockDb)
    // Inside: select max orderIndex → insert node → update path nodeCount
    // The mock's transaction passes chain as tx, so all operations resolve via chain
    mockDb._resolveSelect([{ maxOrder: 2 }]); // max order result
    const newNode = { ...MOCK_NODE, id: 'mock-uuid', orderIndex: 3 };
    mockDb._resolveInsert([newNode]); // insert returning

    const result = await createNodeWithCount('path-1', {
      title: 'Kinematics',
      type: 'experiment',
      experimentId: 'projectile-motion',
    } as any);

    expect(result).toEqual(newNode);
    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('uses orderIndex 0 when no existing nodes', async () => {
    mockDb._resolveSelect([{ maxOrder: null }]); // no existing nodes
    const newNode = { ...MOCK_NODE, id: 'mock-uuid', orderIndex: 0 };
    mockDb._resolveInsert([newNode]);

    const result = await createNodeWithCount('path-1', {
      title: 'First Node',
      type: 'experiment',
      experimentId: 'test',
    } as any);

    expect(result).toEqual(newNode);
    expect(mockDb.transaction).toHaveBeenCalled();
  });

  it('uses provided orderIndex when specified', async () => {
    const newNode = { ...MOCK_NODE, id: 'mock-uuid', orderIndex: 5 };
    mockDb._resolveInsert([newNode]);

    const result = await createNodeWithCount('path-1', {
      title: 'Custom Order',
      type: 'experiment',
      experimentId: 'test',
      orderIndex: 5,
    } as any);

    expect(result).toEqual(newNode);
    expect(mockDb.transaction).toHaveBeenCalled();
  });
});

describe('deleteNodeWithReorder', () => {
  it('deletes node and reorders subsequent nodes', async () => {
    // transaction: select node → delete node → update subsequent orderIndex → update path nodeCount
    mockDb._resolveSelect([MOCK_NODE]);

    await deleteNodeWithReorder('node-1');

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.delete).toHaveBeenCalled();
    expect(mockDb.update).toHaveBeenCalled();
  });

  it('does nothing when node not found', async () => {
    mockDb._resolveSelect([]);

    await deleteNodeWithReorder('nonexistent');

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.delete).not.toHaveBeenCalled();
  });
});

describe('reorderNodes', () => {
  it('updates orderIndex for each node in transaction', async () => {
    await reorderNodes('path-1', ['node-3', 'node-1', 'node-2']);

    expect(mockDb.transaction).toHaveBeenCalled();
    // update is called once per nodeId
    expect(mockDb.update).toHaveBeenCalledTimes(3);
    expect(mockDb.set).toHaveBeenCalledTimes(3);
  });

  it('handles empty nodeIds array', async () => {
    await reorderNodes('path-1', []);

    expect(mockDb.transaction).toHaveBeenCalled();
    expect(mockDb.update).not.toHaveBeenCalled();
  });
});

// ─── Advanced Progress (getOrCreateProgress) ───

describe('getOrCreateProgress', () => {
  it('returns existing progress if found', async () => {
    mockDb._resolveSelect([MOCK_PROGRESS]);

    const result = await getOrCreateProgress('user-1', 'path-1');

    expect(result).toEqual(MOCK_PROGRESS);
    expect(mockDb.insert).not.toHaveBeenCalled();
  });

  it('creates new progress when none exists', async () => {
    // First select: getUserProgressForPath returns nothing
    mockDb._resolveSelect([]);
    // Insert with onConflictDoNothing returns the new record
    const newProgress = { ...MOCK_PROGRESS, id: 'mock-uuid' };
    mockDb._resolveInsert([newProgress]);

    const result = await getOrCreateProgress('user-1', 'path-1');

    expect(result).toEqual(newProgress);
    expect(mockDb.insert).toHaveBeenCalled();
    expect(mockDb.onConflictDoNothing).toHaveBeenCalled();
  });

  it('refetches on race condition (insert returns nothing)', async () => {
    const refetchedProgress = { ...MOCK_PROGRESS, id: 'existing-from-race' };

    // Override then to return different results on successive calls:
    // 1st call (getUserProgressForPath): empty → not found
    // 2nd call (refetch after conflict): found
    let selectCallCount = 0;
    mockDb.then.mockImplementation((resolve: (v: unknown) => void) => {
      selectCallCount++;
      if (selectCallCount === 1) {
        return Promise.resolve([]).then(resolve);
      }
      return Promise.resolve([refetchedProgress]).then(resolve);
    });
    // Insert with onConflictDoNothing → returning resolves with [] (race lost)
    mockDb._resolveInsert([]);

    const result = await getOrCreateProgress('user-1', 'path-1');

    expect(result).toEqual(refetchedProgress);
    expect(mockDb.onConflictDoNothing).toHaveBeenCalled();
  });
});
