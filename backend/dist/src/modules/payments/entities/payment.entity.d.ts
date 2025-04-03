import { User } from '../../users/entities/user.entity';
import { Property } from '../../properties/entities/property.entity';
export declare enum PaymentMethod {
    BANK_TRANSFER = "bank_transfer",
    ZELLE = "zelle",
    VENMO = "venmo"
}
export declare enum PaymentStatus {
    PENDING = "pending",
    COMPLETED = "completed",
    FAILED = "failed"
}
export declare class Payment {
    id: string;
    amount: number;
    paymentMethod: PaymentMethod;
    status: PaymentStatus;
    dueDate: Date;
    paidDate: Date;
    transactionId: string;
    notes: string;
    tenant: User;
    property: Property;
    createdAt: Date;
    updatedAt: Date;
}
