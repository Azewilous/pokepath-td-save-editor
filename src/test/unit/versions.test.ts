import { describe, it, expect } from "vitest";
import { GameVersion, SUPPORTED_VERSIONS } from "~/types/versions";

describe("GameVersion", () => {
  it("V1_4_4 equals the string '1.4.4'", () => {
    expect(GameVersion.V1_4_4).toBe("1.4.4");
  });
});

describe("SUPPORTED_VERSIONS", () => {
  it("includes v1.4.4", () => {
    expect(SUPPORTED_VERSIONS).toContain("1.4.4");
  });

  it("contains only enum values", () => {
    expect(SUPPORTED_VERSIONS).toEqual(Object.values(GameVersion));
  });
});
