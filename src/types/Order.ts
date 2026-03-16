import type { BaseEntity } from '~/types/BaseEntity';
import type { CustomerInfo } from '~/types/CustomerInfo';
import type { Invoice } from '~/types/Invoice';
import type { OrderItem } from '~/types/OrderItem';
import type { Payment } from '~/types/Payment';
import type { ShippingAddress } from '~/types/ShippingAddress';

export enum OrderStatus {
    PENDING = 'pending',
    CONFIRMED = 'confirmed',
    PREPARING = 'preparing',
    SHIPPING = 'shipping',
    DELIVERED = 'delivered',
    CANCELLED = 'cancelled',
}

export interface Order extends BaseEntity {
    orderNumber: string;
    subtotal: number;
    shippingFee: number;
    discountAmount: number;
    totalAmount: number;
    status: OrderStatus;

    // Thông tin khách hàng guest
    customerInfo: CustomerInfo;
    shippingAddress: ShippingAddress;

    items: OrderItem[];
    invoice: Invoice;
    payments: Payment[];
}