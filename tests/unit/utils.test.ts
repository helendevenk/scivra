import { describe, it, expect } from "vitest";
import { cn } from "@/shared/lib/utils";

describe("cn", () => {
  it("should merge class names", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("should resolve Tailwind conflicts (last wins)", () => {
    const result = cn("px-2", "px-4");
    expect(result).toBe("px-4");
  });

  it("should handle conditional and falsy values", () => {
    const result = cn("base", false && "hidden", undefined, null, "extra");
    expect(result).toBe("base extra");
  });
});
