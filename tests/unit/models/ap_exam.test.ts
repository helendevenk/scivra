import { vi, describe, it, expect, beforeEach } from 'vitest';

vi.mock('@/core/db', () => ({ db: vi.fn() }));

import { db } from '@/core/db';
import { createMockDb } from '../../helpers/mock-db';
import {
  createApExam,
  updateApExam,
  findApExamById,
  findApExamBySlug,
  getPublishedExams,
  deleteApExam,
} from '@/shared/models/ap_exam';

let mockDb: ReturnType<typeof createMockDb>;

beforeEach(() => {
  vi.clearAllMocks();
  mockDb = createMockDb();
  vi.mocked(db).mockReturnValue(mockDb as any);
});

const MOCK_EXAM = { id: 'exam-1', slug: 'ap-physics-1', titleEn: 'AP Physics 1', titleZh: 'AP 物理 1', isPublished: true, sort: 1, createdAt: new Date() };

describe('createApExam', () => {
  it('inserts and returns exam', async () => {
    mockDb._resolveInsert([MOCK_EXAM]);
    const result = await createApExam(MOCK_EXAM as any);
    expect(result).toEqual(MOCK_EXAM);
  });
});

describe('updateApExam', () => {
  it('updates and returns exam', async () => {
    mockDb._resolveInsert([{ ...MOCK_EXAM, titleEn: 'Updated' }]);
    const result = await updateApExam('exam-1', { titleEn: 'Updated' });
    expect(result.titleEn).toBe('Updated');
  });
});

describe('findApExamById', () => {
  it('returns exam when found', async () => {
    mockDb._resolveSelect([MOCK_EXAM]);
    expect(await findApExamById('exam-1')).toEqual(MOCK_EXAM);
  });
  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);
    expect(await findApExamById('x')).toBeNull();
  });
});

describe('findApExamBySlug', () => {
  it('returns exam by slug', async () => {
    mockDb._resolveSelect([MOCK_EXAM]);
    expect(await findApExamBySlug('ap-physics-1')).toEqual(MOCK_EXAM);
  });
  it('returns null when not found', async () => {
    mockDb._resolveSelect([]);
    expect(await findApExamBySlug('x')).toBeNull();
  });
});

describe('getPublishedExams', () => {
  it('returns published exams', async () => {
    mockDb._resolveSelect([MOCK_EXAM]);
    const result = await getPublishedExams();
    expect(result).toHaveLength(1);
  });
});

describe('deleteApExam', () => {
  it('deletes and returns exam', async () => {
    mockDb._resolveInsert([MOCK_EXAM]);
    const result = await deleteApExam('exam-1');
    expect(result).toEqual(MOCK_EXAM);
  });
  it('returns null when not found', async () => {
    mockDb._resolveInsert([]);
    const result = await deleteApExam('x');
    expect(result).toBeNull();
  });
});
