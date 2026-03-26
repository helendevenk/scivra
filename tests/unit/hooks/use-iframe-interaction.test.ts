import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIframeInteraction } from "@/shared/hooks/useIframeInteraction";

describe("useIframeInteraction", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should start with hasInteracted = false", () => {
    const { result } = renderHook(() => useIframeInteraction({ timeoutMs: 60000 }));
    expect(result.current.hasInteracted).toBe(false);
  });

  it("should set hasInteracted on postMessage event", () => {
    const { result } = renderHook(() => useIframeInteraction({ timeoutMs: 60000 }));

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "neonphysics:interaction", parameterId: "mass" },
        })
      );
    });

    expect(result.current.hasInteracted).toBe(true);
  });

  it("should auto-unlock after timeout", () => {
    const { result } = renderHook(() => useIframeInteraction({ timeoutMs: 60000 }));

    act(() => {
      vi.advanceTimersByTime(60000);
    });

    expect(result.current.hasInteracted).toBe(true);
  });

  it("should not re-trigger after already interacted", () => {
    const onInteraction = vi.fn();
    const { result } = renderHook(() =>
      useIframeInteraction({ timeoutMs: 60000, onInteraction })
    );

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "neonphysics:interaction", parameterId: "mass" },
        })
      );
    });

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "neonphysics:interaction", parameterId: "velocity" },
        })
      );
    });

    // onInteraction called only once
    expect(onInteraction).toHaveBeenCalledTimes(1);
  });

  it("should ignore messages with wrong type", () => {
    const { result } = renderHook(() => useIframeInteraction({ timeoutMs: 60000 }));

    act(() => {
      window.dispatchEvent(
        new MessageEvent("message", {
          data: { type: "other:event" },
        })
      );
    });

    expect(result.current.hasInteracted).toBe(false);
  });
});
