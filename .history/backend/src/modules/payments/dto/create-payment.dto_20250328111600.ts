import { IsEnum, IsNumber, IsPositive } from 'class-validator';
import { PaymentMethod } from '../entities/payment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePaymentDto {
  @ApiProperty({
    description: 'The amount to be paid',
    example: 1500.00,
    minimum: 0,
  })
  @IsNumber()
  @IsPositive()
  amount: number;

  @ApiProperty({
    description: 'The payment method to be used',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;
} 