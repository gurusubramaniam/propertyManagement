import { Injectable, ForbiddenException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class TenantsService {
  constructor(
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly propertiesService: PropertiesService,
  ) {}

  async getDashboard(userId: string) {
    const user = await this.usersService.findOne(userId);
    
    if (!user || user.role !== 'tenant') {
      throw new ForbiddenException('User is not a tenant');
    }

    const [leaseInfo, paymentHistory] = await Promise.all([
      this.propertiesService.getTenantLeaseInfo(userId),
      this.paymentsService.getTenantPaymentHistory(userId),
    ]);

    return {
      leaseInfo,
      paymentHistory,
    };
  }
} 