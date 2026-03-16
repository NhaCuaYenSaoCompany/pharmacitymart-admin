import type { BaseEntity } from '~/types/BaseEntity';
import type { Order } from '~/types/Order';

export enum PaymentMethod {
    COD = 'cod',
    BANK_TRANSFER = 'bank_transfer',
}

export enum PaymentStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    FAILED = 'failed',
    REFUNDED = 'refunded',
}

export interface Payment extends BaseEntity {
    amount: number;
    method: PaymentMethod;
    transactionId: string | null;
    status: PaymentStatus;
    order: Order;
}