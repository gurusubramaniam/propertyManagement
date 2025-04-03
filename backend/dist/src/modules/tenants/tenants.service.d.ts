import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';
import { PropertiesService } from '../properties/properties.service';
export declare class TenantsService {
    private readonly usersService;
    private readonly paymentsService;
    private readonly propertiesService;
    private readonly logger;
    constructor(usersService: UsersService, paymentsService: PaymentsService, propertiesService: PropertiesService);
    getDashboard(userId: string): Promise<{
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
