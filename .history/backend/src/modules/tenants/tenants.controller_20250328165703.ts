import { Controller, Get, UseGuards } from '@nestjs/common';
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
    return this.tenantsService.getDashboard(user.id);
  }
} 