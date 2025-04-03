import { ApiProperty } from '@nestjs/swagger';
import { PaymentMethod, PaymentStatus } from '../entities/payment.entity';

export class CreatePaymentResponseDto {
  @ApiProperty({
    description: 'Success message',
    example: 'Payment initiated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'Payment details',
    type: 'object',
    properties: {
      id: {
        type: 'string',
        description: 'Unique identifier of the payment',
        example: '123e4567-e89b-12d3-a456-426614174000',
      },
      amount: {
        type: 'number',
        description: 'Amount of the payment',
        example: 1500.0,
      },
      paymentMethod: {
        type: 'string',
        enum: PaymentMethod,
        description: 'Method used for the payment',
        example: PaymentMethod.BANK_TRANSFER,
      },
      transactionId: {
        type: 'string',
        description: 'Unique transaction identifier',
        example: 'PAY-1710931200000-x7f9q2',
      },
      status: {
        type: 'string',
        enum: PaymentStatus,
        description: 'Status of the payment',
        example: PaymentStatus.PENDING,
      },
    },
  })
  payment: {
    id: string;
    amount: number;
    paymentMethod: PaymentMethod;
    transactionId: string;
    status: PaymentStatus;
  };
}
