import { describe, it, expect } from "vitest";
import {
  generatePerformanceDetectionCode,
  generatePerformanceControlUI,
  generateMobileTouchOptimization,
  generateCompletePerformanceTemplate,
  injectPerformanceCode,
  injectPerformanceUI,
  injectMobileOptimization,
} from "@/shared/lib/performance/performance-template";

describe("generatePerformanceDetectionCode", () => {
  it("should return code containing detectDevicePerformanceTier function", () => {
    const code = generatePerformanceDetectionCode();
    expect(code).toContain("detectDevicePerformanceTier");
    expect(code).toContain("performanceConfig");
  });
});

describe("generatePerformanceControlUI", () => {
  it("should return HTML with performance selector element", () => {
    const html = generatePerformanceControlUI();
    expect(html).toContain("performance-selector");
    expect(html).toContain("performance-control");
  });
});

describe("generateMobileTouchOptimization", () => {
  it("should return code handling touch events", () => {
    const code = generateMobileTouchOptimization();
    expect(code).toContain("touchstart");
    expect(code).toContain("touchmove");
  });
});

describe("generateCompletePerformanceTemplate", () => {
  it("should combine detection, mobile, and UI code", () => {
    const template = generateCompletePerformanceTemplate();
    expect(template).toContain("detectDevicePerformanceTier");
    expect(template).toContain("touchstart");
    expect(template).toContain("performance-selector");
  });
});

describe("injectPerformanceCode", () => {
  it("should inject before the first <script> tag", () => {
    const html = "<html><head></head><body><script>app()</script></body></html>";
    const result = injectPerformanceCode(html);
    expect(result).toContain("detectDevicePerformanceTier");
    const scriptIndex = result.indexOf("detectDevicePerformanceTier");
    const appIndex = result.indexOf("app()");
    expect(scriptIndex).toBeLessThan(appIndex);
  });

  it("should inject before </head> if no <script> tag", () => {
    const html = "<html><head></head><body></body></html>";
    const result = injectPerformanceCode(html);
    const detectIndex = result.indexOf("detectDevicePerformanceTier");
    const headEndIndex = result.indexOf("</head>");
    expect(detectIndex).toBeLessThan(headEndIndex);
  });

  it("should return original html unchanged if no insertion point", () => {
    const html = "plain text no tags";
    const result = injectPerformanceCode(html);
    expect(result).toBe(html);
  });
});

describe("injectPerformanceUI", () => {
  it("should inject before </body>", () => {
    const html = "<html><body><p>hi</p></body></html>";
    const result = injectPerformanceUI(html);
    expect(result).toContain("performance-control");
    const uiIndex = result.indexOf("performance-control");
    const bodyEndIndex = result.indexOf("</body>");
    expect(uiIndex).toBeLessThan(bodyEndIndex);
  });

  it("should return original html if no </body>", () => {
    const html = "<div>no body end</div>";
    expect(injectPerformanceUI(html)).toBe(html);
  });
});

describe("injectMobileOptimization", () => {
  it("should inject after the last </script>", () => {
    const html =
      "<body><script>one()</script><script>two()</script></body>";
    const result = injectMobileOptimization(html);
    expect(result).toContain("touchstart");
  });

  it("should return original html if no </script>", () => {
    const html = "<body>no scripts</body>";
    expect(injectMobileOptimization(html)).toBe(html);
  });
});
