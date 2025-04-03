import { Controller, Get, UseGuards, Logger } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { TenantsService } from './tenants.service';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Tenant Dashboard')
@Controller('tenant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class TenantsController {
  private readonly logger = new Logger(TenantsController.name);

  constructor(private readonly tenantsService: TenantsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Get tenant dashboard data' })
  @ApiResponse({
    status: 200,
    description: 'Returns tenant dashboard data including lease info and payment history',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not a tenant',
  })
  async getDashboard(@User() user: UserEntity) {
    this.logger.log(`Fetching dashboard data for user: ${user.id}`);
    try {
      const data = await this.tenantsService.getDashboard(user.id);
      this.logger.log(`Successfully fetched dashboard data for user: ${user.id}`);
      return data;
    } catch (error) {
      this.logger.error(`Error fetching dashboard data for user: ${user.id}`, error);
      throw error;
    }
  }
} 