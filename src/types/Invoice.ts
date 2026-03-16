import type { BaseEntity } from '~/types/BaseEntity';
import type { Order } from '~/types/Order';

export enum InvoiceStatus {
    UNPAID = 'unpaid',
    PAID = 'paid',
    CANCELLED = 'cancelled',
}

export interface Invoice extends BaseEntity {
    invoiceNumber: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    totalAmount: number;
    issueDate: Date;
    status: InvoiceStatus;
    order: Order;
}