import type { BaseEntity } from '~/types/BaseEntity';
import type { Product } from '~/types/Product';

export interface ProductVariant extends BaseEntity {
    dosageStrength: string;
    volume: string | null;
    sku: string;
    name: string;
    price: number;
    stock: number;
    activeIngredients: Array<{
        name: string;
        strength: string;
    }>;
    excipients: string | null;
    contraindications: string;
    warnings: string | null;
    usageInstructions: string | null;
    pensPerBox: number;
    isStartingDose: boolean;
    isMaintenanceDose: boolean;
    productId: number;
    product: Product;
}