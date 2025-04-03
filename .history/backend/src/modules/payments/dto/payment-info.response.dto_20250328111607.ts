import { ApiProperty } from '@nestjs/swagger';

export class PaymentInfoResponseDto {
  @ApiProperty({
    description: 'The total amount due',
    example: 1500.00,
  })
  amountDue: number;

  @ApiProperty({
    description: 'The name of the property',
    example: 'Sunset Apartments',
  })
  propertyName: string;

  @ApiProperty({
    description: 'The address of the property',
    example: '123 Main St, City, State 12345',
  })
  propertyAddress: string;
} 