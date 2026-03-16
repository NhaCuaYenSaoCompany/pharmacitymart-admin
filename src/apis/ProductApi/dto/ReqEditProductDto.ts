
export interface ReqEditProductDto {
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
  // variants: ProductVariant[];

  categoryId: number;
}
