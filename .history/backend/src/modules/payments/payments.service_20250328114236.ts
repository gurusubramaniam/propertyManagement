import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Payment, PaymentStatus } from './entities/payment.entity';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { User, UserRole } from '../users/entities/user.entity';
import { Property } from '../properties/entities/property.entity';

@Injectable()
export class PaymentsService {
  constructor(
    @InjectRepository(Payment)
    private paymentsRepository: Repository<Payment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
  ) {}

  async getTenantPaymentInfo(tenantId: string) {
    const tenant = await this.usersRepository.findOne({
      where: { id: tenantId, role: UserRole.TENANT },
      relations: ['properties'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    // Get the tenant's active property
    const property = tenant.properties[0];
    if (!property) {
      throw new NotFoundException('No active property found for tenant');
    }

    // Calculate amount due based on rent and any pending payments
    const pendingPayments = await this.paymentsRepository.find({
      where: {
        tenant: { id: tenantId },
        status: PaymentStatus.PENDING,
      },
    });

    const totalPending = pendingPayments.reduce((sum, payment) => sum + Number(payment.amount), 0);
    const amountDue = Number(property.rentAmount) + totalPending;

    return {
      amountDue,
      propertyName: property.name,
      propertyAddress: property.address,
    };
  }

  async createPayment(tenantId: string, createPaymentDto: CreatePaymentDto) {
    const tenant = await this.usersRepository.findOne({
      where: { id: tenantId, role: UserRole.TENANT },
      relations: ['properties'],
    });

    if (!tenant) {
      throw new NotFoundException('Tenant not found');
    }

    const property = tenant.properties[0];
    if (!property) {
      throw new NotFoundException('No active property found for tenant');
    }

    // Create a new payment record
    const payment = this.paymentsRepository.create({
      ...createPaymentDto,
      tenant,
      property,
      status: PaymentStatus.PENDING,
      dueDate: new Date(),
    });

    // Save the payment
    const savedPayment = await this.paymentsRepository.save(payment);

    // Generate a unique transaction ID
    const transactionId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    savedPayment.transactionId = transactionId;
    await this.paymentsRepository.save(savedPayment);

    return {
      message: 'Payment initiated successfully',
      payment: {
        id: savedPayment.id,
        amount: savedPayment.amount,
        paymentMethod: savedPayment.paymentMethod,
        transactionId: savedPayment.transactionId,
        status: savedPayment.status,
      },
    };
  }

  async getTenantPaymentHistory(tenantId: string) {
    const payments = await this.paymentsRepository.find({
      where: { tenant: { id: tenantId } },
      relations: ['property'],
      order: { createdAt: 'DESC' },
    });

    return payments.map(payment => ({
      id: payment.id,
      amount: payment.amount,
      paymentMethod: payment.paymentMethod,
      status: payment.status,
      transactionId: payment.transactionId,
      dueDate: payment.dueDate,
      createdAt: payment.createdAt,
      propertyName: payment.property.name,
    }));
  }
} 