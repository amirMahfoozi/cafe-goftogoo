export type MenuCategoryId =
  "coffee" | "breakfast" | "cold" | "mocktail" | "tea" | "dessert" | "food";

export type MenuBadge = "محبوب" | "جدید" | "گیاهی";

export type CategoryIconName = MenuCategoryId;

export interface CafeInfo {
  name: string;
  tagline: string;
  description?: string;
  phone?: string;
  instagramUrl?: string;
  mapUrl?: string;
  address?: string;
  openingHours?: string;
  heroImage: string;
  heroImageAlt: string;
  logoImage?: string;
}

export interface MenuVariant {
  label: string;
  price: number;
}

export interface MenuItem {
  id: string;
  categoryId: MenuCategoryId;
  name: string;
  englishName?: string;
  description?: string;
  price?: number;
  variants?: MenuVariant[];
  priceNote?: string;
  image: string;
  imageAlt: string;
  badge?: MenuBadge;
  available?: boolean;
  allergens?: string[];
  order: number;
}

export interface MenuCategory {
  id: MenuCategoryId;
  title: string;
  icon: CategoryIconName;
  order: number;
}
