import { UserEntity } from '../users/entities/user.entity';
import { TenantsService } from './tenants.service';
export declare class TenantsController {
    private readonly tenantsService;
    private readonly logger;
    constructor(tenantsService: TenantsService);
    getDashboard(user: UserEntity): Promise<{
        leaseInfo: {
            propertyName: string;
            address: string;
            leaseStartDate: Date;
            leaseEndDate: Date;
            rentAmount: number;
            nextPaymentDue: Date;
        };
        paymentHistory: {
            id: string;
            amount: number;
            paymentMethod: import("../payments/entities/payment.entity").PaymentMethod;
            status: import("../payments/entities/payment.entity").PaymentStatus;
            transactionId: string;
            dueDate: Date;
            createdAt: Date;
            propertyName: string;
        }[];
    }>;
}
