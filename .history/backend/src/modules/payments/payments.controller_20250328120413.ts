import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';

@ApiTags('Tenant Payments')
@Controller('payments')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('tenant/payment-info')
  @ApiOperation({ summary: 'Get tenant payment information' })
  @ApiResponse({
    status: 200,
    description: 'Returns tenant payment information',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Tenant or property not found',
  })
  async getTenantPaymentInfo(@User() user: UserEntity) {
    return this.paymentsService.getTenantPaymentInfo(user.id);
  }

  @Post('tenant/payment')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment created successfully',
  })
  @ApiResponse({
    status: 400,
    description: 'Bad Request - Invalid payment data',
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not a tenant',
  })
  @ApiResponse({
    status: 404,
    description: 'Not Found - Tenant or property not found',
  })
  async createPayment(
    @User() user: UserEntity,
    @Body() createPaymentDto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(user.id, createPaymentDto);
  }

  @Get('tenant/payment-history')
  @ApiOperation({ summary: 'Get tenant payment history' })
  @ApiResponse({
    status: 200,
    description: 'Returns tenant payment history',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not a tenant',
  })
  async getTenantPaymentHistory(@User() user: UserEntity) {
    return this.paymentsService.getTenantPaymentHistory(user.id);
  }

  @Get('tenant/payment/:id')
  @ApiOperation({ summary: 'Get specific payment details' })
  @ApiResponse({
    status: 200,
    description: 'Returns payment details',
  })
  @ApiResponse({
    status: 404,
    description: 'Payment not found',
  })
  async getTenantPayment(@User() user: UserEntity, @Param('id') id: string) {
    return this.paymentsService.getTenantPayment(user.id, id);
  }
}
