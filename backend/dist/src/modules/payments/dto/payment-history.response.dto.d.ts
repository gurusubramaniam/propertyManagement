import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';
export declare class PaymentHistoryItemDto {
    id: string;
    date: Date;
    amount: number;
    status: PaymentStatus;
    paymentMethod: PaymentMethod;
    propertyName: string;
    invoiceUrl: string;
}
export declare class PaymentHistoryResponseDto {
    payments: PaymentHistoryItemDto[];
}
