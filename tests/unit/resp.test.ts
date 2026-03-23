import { describe, it, expect } from 'vitest';
import { respData, respOk, respErr, respJson } from '@/shared/lib/resp';

describe('respData', () => {
  it('returns code 0, message "ok", data array', async () => {
    const res = respData([1, 2, 3]);
    const json = await res.json();
    expect(json.code).toBe(0);
    expect(json.message).toBe('ok');
    expect(json.data).toEqual([1, 2, 3]);
  });

  it('handles null data by returning empty array', async () => {
    const res = respData(null);
    const json = await res.json();
    expect(json.code).toBe(0);
    expect(json.message).toBe('ok');
    expect(json.data).toEqual([]);
  });
});

describe('respOk', () => {
  it('returns code 0, message "ok", no data field', async () => {
    const res = respOk();
    const json = await res.json();
    expect(json.code).toBe(0);
    expect(json.message).toBe('ok');
    expect(json.data).toBeUndefined();
  });
});

describe('respErr', () => {
  it('returns code -1 with custom message', async () => {
    const res = respErr('something went wrong');
    const json = await res.json();
    expect(json.code).toBe(-1);
    expect(json.message).toBe('something went wrong');
  });

  it('handles empty string message', async () => {
    const res = respErr('');
    const json = await res.json();
    expect(json.code).toBe(-1);
    expect(json.message).toBe('');
  });
});

describe('respJson', () => {
  it('returns Response.json with code/message/data', async () => {
    const res = respJson(0, 'ok', { foo: 'bar' });
    expect(res).toBeInstanceOf(Response);
    const json = await res.json();
    expect(json.code).toBe(0);
    expect(json.message).toBe('ok');
    expect(json.data).toEqual({ foo: 'bar' });
  });

  it('omits data field when data is undefined', async () => {
    const res = respJson(0, 'ok');
    const json = await res.json();
    expect(json.code).toBe(0);
    expect(json.message).toBe('ok');
    expect(json.data).toBeUndefined();
  });

  it('includes data field when data is provided', async () => {
    const res = respJson(1, 'test', [1, 2, 3]);
    const json = await res.json();
    expect(json.data).toEqual([1, 2, 3]);
  });
});
