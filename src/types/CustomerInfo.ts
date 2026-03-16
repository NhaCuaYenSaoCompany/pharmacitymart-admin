import type { BaseEntity } from '~/types/BaseEntity';
import type { Order } from '~/types/Order';

export interface CustomerInfo extends BaseEntity {
    fullName: string;
    phone: string | null;
    email: string | null;
    note: string | null;
    orders: Order[];
}