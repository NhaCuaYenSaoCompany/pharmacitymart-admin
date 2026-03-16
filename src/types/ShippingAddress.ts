import type { BaseEntity } from '~/types/BaseEntity';
import type { Order } from '~/types/Order';

export interface ShippingAddress extends BaseEntity {
    street: string;
    ward: string;
    district: string;
    city: string;
    orders: Order[];
}