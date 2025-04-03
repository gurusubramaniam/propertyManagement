import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';
export declare class CreatePaymentResponseDto {
    message: string;
    payment: {
        id: string;
        amount: number;
        paymentMethod: PaymentMethod;
        transactionId: string;
        status: PaymentStatus;
    };
}
