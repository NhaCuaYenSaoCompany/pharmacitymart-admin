import type { BaseEntity } from '~/types/BaseEntity';
import type { Order } from '~/types/Order';
import type { Product } from '~/types/Product';
import type { ProductVariant } from '~/types/ProductVariant';

export interface OrderItem extends BaseEntity {
    order: Order;
    product: Product;
    variant: ProductVariant | null;
    productName: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}