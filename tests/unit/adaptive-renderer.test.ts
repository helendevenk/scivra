import { describe, it, expect } from "vitest";
import {
  getRenderConfig,
  generateRendererCode,
  generateGeometryCode,
  generateFPSMonitorCode,
} from "@/shared/lib/performance/adaptive-renderer";
import type { RenderConfig } from "@/shared/lib/performance/adaptive-renderer";

describe("getRenderConfig", () => {
  it("should return high config with antialias and shadows enabled", () => {
    const config = getRenderConfig("high");
    expect(config.antialias).toBe(true);
    expect(config.shadowMapEnabled).toBe(true);
    expect(config.geometryDetail).toBe("high");
    expect(config.targetFPS).toBe(60);
  });

  it("should return medium config with shadows disabled", () => {
    const config = getRenderConfig("medium");
    expect(config.shadowMapEnabled).toBe(false);
    expect(config.geometryDetail).toBe("medium");
    expect(config.targetFPS).toBe(45);
  });

  it("should return low config with reduced motion", () => {
    const config = getRenderConfig("low");
    expect(config.antialias).toBe(false);
    expect(config.reducedMotion).toBe(true);
    expect(config.maxParticles).toBe(1000);
    expect(config.targetFPS).toBe(30);
  });

  it("should default to medium for unknown tier", () => {
    const config = getRenderConfig("unknown" as never);
    expect(config.geometryDetail).toBe("medium");
  });
});

describe("generateRendererCode", () => {
  it("should include antialias setting in output", () => {
    const config = getRenderConfig("high");
    const code = generateRendererCode(config);
    expect(code).toContain("antialias: true");
    expect(code).toContain("high-performance");
  });

  it("should use low-power preference when batteryOptimization is on", () => {
    const config = getRenderConfig("low");
    const code = generateRendererCode(config);
    expect(code).toContain("low-power");
  });
});

describe("generateGeometryCode", () => {
  it("should produce sphere geometry with correct segments for each tier", () => {
    const high = generateGeometryCode(getRenderConfig("high"), "sphere");
    expect(high).toContain("SphereGeometry");
    expect(high).toContain("64");

    const low = generateGeometryCode(getRenderConfig("low"), "sphere");
    expect(low).toContain("16");
  });

  it("should produce cylinder geometry code", () => {
    const code = generateGeometryCode(getRenderConfig("medium"), "cylinder");
    expect(code).toContain("CylinderGeometry");
    expect(code).toContain("32");
  });

  it("should produce torus geometry code", () => {
    const code = generateGeometryCode(getRenderConfig("high"), "torus");
    expect(code).toContain("TorusGeometry");
  });
});

describe("generateFPSMonitorCode", () => {
  it("should return disabled comment when adaptive degradation is off", () => {
    const config = getRenderConfig("high");
    const code = generateFPSMonitorCode(config);
    expect(code).toContain("已禁用");
  });

  it("should return monitoring code when adaptive degradation is on", () => {
    const config = getRenderConfig("medium");
    const code = generateFPSMonitorCode(config);
    expect(code).toContain("monitorFPS");
    expect(code).toContain(`${config.targetFPS}`);
  });
});
