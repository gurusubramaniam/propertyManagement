import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { PaymentInfoResponseDto } from './dto/payment-info.response.dto';
import { PaymentHistoryResponseDto } from './dto/payment-history.response.dto';
import { CreatePaymentResponseDto } from './dto/create-payment.response.dto';

@ApiTags('Tenant Payments')
@Controller('tenant')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('payment-info')
  @ApiOperation({ summary: 'Get tenant payment information' })
  @ApiResponse({
    status: 200,
    description: 'Returns the current amount due and property information',
    type: PaymentInfoResponseDto,
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
  async getPaymentInfo(@Request() req) {
    if (req.user.role !== UserRole.TENANT) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.getTenantPaymentInfo(req.user.id);
  }

  @Post('payments')
  @ApiOperation({ summary: 'Create a new payment' })
  @ApiResponse({
    status: 201,
    description: 'Payment has been successfully created',
    type: CreatePaymentResponseDto,
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
  async createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    if (req.user.role !== UserRole.TENANT) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.createPayment(req.user.id, createPaymentDto);
  }

  @Get('payment-history')
  @ApiOperation({ summary: 'Get tenant payment history' })
  @ApiResponse({
    status: 200,
    description: 'Returns the list of all payments made by the tenant',
    type: PaymentHistoryResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - User is not authenticated',
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - User is not a tenant',
  })
  async getPaymentHistory(@Request() req) {
    if (req.user.role !== UserRole.TENANT) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.getTenantPaymentHistory(req.user.id);
  }
} 