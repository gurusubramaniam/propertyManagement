import { Controller, Get, Post, Body, UseGuards, Request } from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UserRole } from '../users/entities/user.entity';

@Controller('tenant')
@UseGuards(JwtAuthGuard)
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Get('payment-info')
  async getPaymentInfo(@Request() req) {
    if (req.user.role !== UserRole.TENANT) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.getTenantPaymentInfo(req.user.id);
  }

  @Post('payments')
  async createPayment(@Request() req, @Body() createPaymentDto: CreatePaymentDto) {
    if (req.user.role !== UserRole.TENANT) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.createPayment(req.user.id, createPaymentDto);
  }

  @Get('payment-history')
  async getPaymentHistory(@Request() req) {
    if (req.user.role !== UserRole.TENANT) {
      throw new Error('Unauthorized');
    }
    return this.paymentsService.getTenantPaymentHistory(req.user.id);
  }
} 