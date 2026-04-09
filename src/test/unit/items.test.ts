import { describe, it, expect } from "vitest";
import { toItemId, toItemEntry } from "~/types/items";

describe("toItemId", () => {
  it("lowercases a single word", () => {
    expect(toItemId("Potion")).toBe("potion");
  });

  it("camelCases two words separated by a space", () => {
    expect(toItemId("Light Clay")).toBe("lightClay");
  });

  it("camelCases words separated by a hyphen", () => {
    expect(toItemId("X-Attack")).toBe("xAttack");
  });

  it("camelCases three or more words", () => {
    expect(toItemId("Shield Breaker Bullet")).toBe("shieldBreakerBullet");
  });

  it("handles mixed spaces and hyphens", () => {
    expect(toItemId("Choice Scarf-Plus")).toBe("choiceScarfPlus");
  });
});

describe("toItemEntry", () => {
  const gameItem = {
    name: "Choice Band",
    effect: "Boosts Attack by 50%",
    price: 500,
    imgSrc: "choiceBand.png",
  };

  it("derives id from name via toItemId", () => {
    expect(toItemEntry(gameItem).id).toBe("choiceBand");
  });

  it("wraps name in an array", () => {
    expect(toItemEntry(gameItem).name).toEqual(["Choice Band"]);
  });

  it("maps imgSrc to sprite", () => {
    expect(toItemEntry(gameItem).sprite).toBe("choiceBand.png");
  });

  it("maps effect to description array", () => {
    expect(toItemEntry(gameItem).description).toEqual(["Boosts Attack by 50%"]);
  });

  it("preserves price", () => {
    expect(toItemEntry(gameItem).price).toBe(500);
  });

  it("sets empty restriction", () => {
    expect(toItemEntry(gameItem).restriction).toEqual({});
  });
});
