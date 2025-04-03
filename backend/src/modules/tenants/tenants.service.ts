import { Injectable, ForbiddenException, Logger } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { PaymentsService } from '../payments/payments.service';
import { PropertiesService } from '../properties/properties.service';

@Injectable()
export class TenantsService {
  private readonly logger = new Logger(TenantsService.name);

  constructor(
    private readonly usersService: UsersService,
    private readonly paymentsService: PaymentsService,
    private readonly propertiesService: PropertiesService,
  ) {}

  async getDashboard(userId: string) {
    this.logger.log(`Getting dashboard data for user: ${userId}`);
    
    const user = await this.usersService.findOne(userId);
    this.logger.log(`Found user: ${JSON.stringify(user)}`);
    
    if (!user || user.role !== 'tenant') {
      this.logger.warn(`User ${userId} is not a tenant`);
      throw new ForbiddenException('User is not a tenant');
    }

    try {
      const [leaseInfo, paymentHistory] = await Promise.all([
        this.propertiesService.getTenantLeaseInfo(userId),
        this.paymentsService.getTenantPaymentHistory(userId),
      ]);

      this.logger.log(`Successfully fetched dashboard data for user: ${userId}`);
      return {
        leaseInfo,
        paymentHistory,
      };
    } catch (error) {
      this.logger.error(`Error fetching dashboard data for user: ${userId}`, error);
      throw error;
    }
  }
} 