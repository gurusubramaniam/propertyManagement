import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class PaymentHistoryItemDto {
  @ApiProperty({
    description: 'Unique identifier of the payment',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  id: string;

  @ApiProperty({
    description: 'Date when the payment was created',
    example: '2024-03-20T10:00:00Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Amount of the payment',
    example: 1500.0,
  })
  amount: number;

  @ApiProperty({
    description: 'Status of the payment',
    enum: PaymentStatus,
    example: PaymentStatus.COMPLETED,
  })
  status: PaymentStatus;

  @ApiProperty({
    description: 'Method used for the payment',
    enum: PaymentMethod,
    example: PaymentMethod.BANK_TRANSFER,
  })
  paymentMethod: PaymentMethod;

  @ApiProperty({
    description: 'Name of the property',
    example: 'Sunset Apartments',
  })
  propertyName: string;

  @ApiProperty({
    description: 'URL to download the payment invoice',
    example: '/api/payments/123e4567-e89b-12d3-a456-426614174000/invoice',
  })
  invoiceUrl: string;
}

export class PaymentHistoryResponseDto {
  @ApiProperty({
    type: [PaymentHistoryItemDto],
    description: 'List of payment history items',
  })
  payments: PaymentHistoryItemDto[];
}
