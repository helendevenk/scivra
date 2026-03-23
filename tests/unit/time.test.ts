import { describe, it, expect } from "vitest";
import {
  getIsoTimestr,
  getTimestamp,
  getMillisecond,
  getOneYearLaterTimestr,
} from "@/shared/lib/time";

describe("getIsoTimestr", () => {
  it("should return a valid ISO 8601 string", () => {
    const iso = getIsoTimestr();
    expect(new Date(iso).toISOString()).toBe(iso);
  });
});

describe("getTimestamp", () => {
  it("should return seconds since epoch (10-digit integer)", () => {
    const ts = getTimestamp();
    expect(Number.isInteger(ts)).toBe(true);
    expect(ts.toString()).toMatch(/^\d{10}$/);
  });
});

describe("getMillisecond", () => {
  it("should return milliseconds since epoch (13-digit integer)", () => {
    const ms = getMillisecond();
    expect(Number.isInteger(ms)).toBe(true);
    expect(ms.toString()).toMatch(/^\d{13}$/);
  });
});

describe("getOneYearLaterTimestr", () => {
  it("should return an ISO string exactly one year in the future", () => {
    const now = new Date();
    const result = new Date(getOneYearLaterTimestr());
    const expectedYear = now.getFullYear() + 1;
    expect(result.getFullYear()).toBe(expectedYear);
    expect(result.getMonth()).toBe(now.getMonth());
  });
});
