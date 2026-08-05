import { describe, expect, it } from "vitest";
import { menuCategories, menuItems } from "../src/data/menu";
import {
  getHorizontalRevealDelta,
  getSectionScrollTop,
} from "../src/scripts/category-navigation";
import type { MenuItem } from "../src/types/menu";
import { formatPrice } from "../src/utils/formatPrice";
import { validateMenu } from "../src/utils/menuValidation";

describe("formatPrice", () => {
  it("formats prices using Persian numerals", () => {
    expect(formatPrice(230)).toBe("۲۳۰");
    expect(formatPrice(1250)).toBe("۱٬۲۵۰");
  });
});

describe("menu validation", () => {
  it("accepts the production menu", () => {
    expect(validateMenu(menuItems, menuCategories)).toEqual({
      valid: true,
      errors: [],
    });
  });

  it("rejects duplicate item IDs", () => {
    const duplicated = [...menuItems, menuItems[0] as MenuItem];
    const result = validateMenu(duplicated, menuCategories);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(`Duplicate item id: ${menuItems[0]?.id}`);
  });

  it("requires exactly one price source", () => {
    const invalidItem: MenuItem = {
      id: "invalid-price-source",
      categoryId: "coffee",
      name: "آیتم آزمایشی",
      price: 100,
      variants: [{ label: "بزرگ", price: 120 }],
      image: "/images/menu/coffee/invalid.webp",
      imageAlt: "تصویر آزمایشی",
      order: 99,
    };

    const result = validateMenu([...menuItems, invalidItem], menuCategories);

    expect(result.valid).toBe(false);
    expect(result.errors).toContain(
      "Item invalid-price-source must have exactly one valid price source (price, variants, or priceNote).",
    );
  });

  it("accepts an explicit price note when the board price is unreadable", () => {
    const noteOnlyItem: MenuItem = {
      id: "price-note-only",
      categoryId: "dessert",
      name: "آیتم آزمایشی",
      priceNote: "استعلام قیمت",
      image: "/images/menu/dessert/example.webp",
      imageAlt: "تصویر آزمایشی",
      order: 99,
    };

    const result = validateMenu([...menuItems, noteOnlyItem], menuCategories);

    expect(result.valid).toBe(true);
  });
});

describe("category navigation geometry", () => {
  it("calculates the vertical destination without coupling it to chip scrolling", () => {
    expect(getSectionScrollTop(1200, 640, 0, 88)).toBe(1740);
    expect(getSectionScrollTop(0, 40, 0, 88)).toBe(0);
  });

  it("reveals only clipped category chips on the horizontal rail", () => {
    const rail = { left: 0, right: 390, width: 390 };

    expect(
      getHorizontalRevealDelta(rail, { left: 110, right: 210, width: 100 }),
    ).toBeNull();
    expect(
      getHorizontalRevealDelta(rail, { left: 360, right: 460, width: 100 }),
    ).toBe(215);
  });
});
