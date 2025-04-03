import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { UserEntity } from '../users/entities/user.entity';
export declare class PaymentsController {
    private readonly paymentsService;
    constructor(paymentsService: PaymentsService);
    getTenantPaymentInfo(user: UserEntity): Promise<{
        amountDue: number;
        propertyName: string;
        propertyAddress: string;
    }>;
    createPayment(user: UserEntity, createPaymentDto: CreatePaymentDto): Promise<{
        message: string;
        payment: {
            id: string;
            amount: number;
            paymentMethod: import("./entities/payment.entity").PaymentMethod;
            transactionId: string;
            status: import("./entities/payment.entity").PaymentStatus;
        };
    }>;
    getTenantPaymentHistory(user: UserEntity): Promise<{
        id: string;
        amount: number;
        paymentMethod: import("./entities/payment.entity").PaymentMethod;
        status: import("./entities/payment.entity").PaymentStatus;
        transactionId: string;
        dueDate: Date;
        createdAt: Date;
        propertyName: string;
    }[]>;
    getTenantPayment(user: UserEntity, id: string): Promise<{
        id: string;
        amount: number;
        paymentMethod: import("./entities/payment.entity").PaymentMethod;
        status: import("./entities/payment.entity").PaymentStatus;
        transactionId: string;
        dueDate: Date;
        createdAt: Date;
        propertyName: string;
    }>;
    getAllPayments(user: UserEntity): Promise<{
        id: string;
        amount: number;
        date: Date;
        status: import("./entities/payment.entity").PaymentStatus;
        tenantName: string;
        propertyName: string;
    }[]>;
}
