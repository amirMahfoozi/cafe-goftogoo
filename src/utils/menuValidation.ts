import type { MenuCategory, MenuItem } from "@/types/menu";

export interface MenuValidationResult {
  valid: boolean;
  errors: string[];
}

function hasValidSinglePrice(item: MenuItem): boolean {
  return (
    typeof item.price === "number" &&
    Number.isFinite(item.price) &&
    item.price >= 0
  );
}

function hasValidVariants(item: MenuItem): boolean {
  return (
    Array.isArray(item.variants) &&
    item.variants.length > 0 &&
    item.variants.every(
      (variant) =>
        variant.label.trim().length > 0 &&
        Number.isFinite(variant.price) &&
        variant.price >= 0,
    )
  );
}

function hasValidPriceNote(item: MenuItem): boolean {
  return typeof item.priceNote === "string" && item.priceNote.trim().length > 0;
}

export function validateMenu(
  items: readonly MenuItem[],
  categories: readonly MenuCategory[],
): MenuValidationResult {
  const errors: string[] = [];
  const seenIds = new Set<string>();
  const categoryIds = new Set(categories.map((category) => category.id));

  for (const item of items) {
    if (seenIds.has(item.id)) {
      errors.push(`Duplicate item id: ${item.id}`);
    }
    seenIds.add(item.id);

    const hasPrice = hasValidSinglePrice(item);
    const hasVariants = hasValidVariants(item);
    const hasPriceNote = hasValidPriceNote(item);
    const priceSourceCount = [hasPrice, hasVariants, hasPriceNote].filter(
      Boolean,
    ).length;

    if (priceSourceCount !== 1) {
      errors.push(
        `Item ${item.id} must have exactly one valid price source (price, variants, or priceNote).`,
      );
    }

    if (!categoryIds.has(item.categoryId)) {
      errors.push(`Item ${item.id} uses unknown category: ${item.categoryId}`);
    }

    if (!item.image.startsWith("/images/menu/")) {
      errors.push(`Item ${item.id} must use a local menu image path.`);
    }
  }

  return { valid: errors.length === 0, errors };
}

export function assertValidMenu(
  items: readonly MenuItem[],
  categories: readonly MenuCategory[],
): void {
  const result = validateMenu(items, categories);

  if (!result.valid) {
    throw new Error(result.errors.join("\n"));
  }
}
