import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';
export declare class PaymentsService {
    private paymentsRepository;
    private usersRepository;
    private propertiesRepository;
    constructor(paymentsRepository: Repository<Payment>, usersRepository: Repository<User>, propertiesRepository: Repository<Property>);
    getAllPayments(user: User): Promise<{
        id: string;
        amount: number;
        date: Date;
        status: PaymentStatus;
        tenantName: string;
        propertyName: string;
    }[]>;
    getTenantPaymentInfo(tenantId: string): Promise<{
        amountDue: number;
        propertyName: string;
        propertyAddress: string;
    }>;
    createPayment(tenantId: string, createPaymentDto: CreatePaymentDto): Promise<{
        message: string;
        payment: {
            id: string;
            amount: number;
            paymentMethod: import("./entities/payment.entity").PaymentMethod;
            transactionId: string;
            status: PaymentStatus;
        };
    }>;
    getTenantPaymentHistory(tenantId: string): Promise<{
        id: string;
        amount: number;
        paymentMethod: import("./entities/payment.entity").PaymentMethod;
        status: PaymentStatus;
        transactionId: string;
        dueDate: Date;
        createdAt: Date;
        propertyName: string;
    }[]>;
    getTenantPayment(tenantId: string, paymentId: string): Promise<{
        id: string;
        amount: number;
        paymentMethod: import("./entities/payment.entity").PaymentMethod;
        status: PaymentStatus;
        transactionId: string;
        dueDate: Date;
        createdAt: Date;
        propertyName: string;
    }>;
}
