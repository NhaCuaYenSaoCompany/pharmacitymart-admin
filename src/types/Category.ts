import type { BaseEntity } from "~/types/BaseEntity";

export interface Category extends BaseEntity {
  title: string;
  slug: string;
  order: number;
}
