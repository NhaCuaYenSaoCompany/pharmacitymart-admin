import type { BaseEntity } from "~/types/BaseEntity";
import type { Category } from "~/types/Category";

export interface Product extends BaseEntity {
  name: string;
  slug: string;
  shortDescription: string;
  description: string;
  price: number;
  thumbnailUrl: string;
  images: string[];
  stock: number;
  genericName: string;
  brandName: string;
  manufacturer: string;
  requiresPrescription: boolean;
  storageInstruction: string;
  generalWarning: string;
  isActive: boolean;
  category: Category;
  regionId: number;
  dosage: number;
  // variants: ProductVariant[];

  categoryId: number;
}
