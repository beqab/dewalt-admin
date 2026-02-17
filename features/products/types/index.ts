import type { LocalizedText } from "@/features/categories/types";

export interface ProductSpec {
  label: LocalizedText;
  value: LocalizedText;
}

export interface Product {
  _id: string;
  name: LocalizedText;
  code: string;
  finaId?: number;
  finaCode?: string;
  description: LocalizedText;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock: boolean;
  quantity: number;
  rating: number;
  reviewCount: number;
  slug: string;
  brandId: { _id: string; name: LocalizedText; slug: string };
  categoryId: { _id: string; name: LocalizedText; slug: string };
  childCategoryId?: { _id: string; name: LocalizedText; slug: string };
  specs: ProductSpec[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateProductDto {
  name: LocalizedText;
  code: string;
  finaId?: number;
  finaCode?: string;
  description: LocalizedText;
  image: string;
  images?: string[];
  price: number;
  originalPrice?: number;
  discount?: number;
  inStock?: boolean;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  slug: string;
  brandId: string;
  categoryId: string;
  childCategoryId?: string;
  specs?: ProductSpec[];
}

export interface UpdateProductDto {
  name?: LocalizedText;
  code?: string;
  finaId?: number;
  finaCode?: string;
  description?: LocalizedText;
  image?: string;
  images?: string[];
  price?: number;
  originalPrice?: number;
  discount?: number;
  inStock?: boolean;
  quantity?: number;
  rating?: number;
  reviewCount?: number;
  slug?: string;
  brandId?: string;
  categoryId?: string;
  childCategoryId?: string;
  specs?: ProductSpec[];
}

export type ProductResponse = Product;
