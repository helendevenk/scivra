import { describe, it, expect } from "vitest";
import { getUuid, getUniSeq, getNonceStr, getSnowId } from "@/shared/lib/hash";

describe("getUuid", () => {
  it("should return a valid UUID v4 string", () => {
    const uuid = getUuid();
    expect(uuid).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  it("should return unique values on each call", () => {
    const a = getUuid();
    const b = getUuid();
    expect(a).not.toBe(b);
  });
});

describe("getUniSeq", () => {
  it("should return a non-empty string without prefix", () => {
    const seq = getUniSeq();
    expect(seq.length).toBeGreaterThan(0);
  });

  it("should prepend the given prefix", () => {
    const seq = getUniSeq("order_");
    expect(seq.startsWith("order_")).toBe(true);
  });
});

describe("getNonceStr", () => {
  it("should return a string of the requested length", () => {
    expect(getNonceStr(16)).toHaveLength(16);
    expect(getNonceStr(0)).toHaveLength(0);
    expect(getNonceStr(1)).toHaveLength(1);
  });

  it("should only contain alphanumeric characters", () => {
    const nonce = getNonceStr(100);
    expect(nonce).toMatch(/^[A-Za-z0-9]+$/);
  });
});

describe("getSnowId", () => {
  it("should return a numeric string", () => {
    const id = getSnowId();
    expect(id).toMatch(/^\d+$/);
  });

  it("should return unique values on each call", () => {
    const ids = new Set(Array.from({ length: 10 }, () => getSnowId()));
    expect(ids.size).toBe(10);
  });
});
