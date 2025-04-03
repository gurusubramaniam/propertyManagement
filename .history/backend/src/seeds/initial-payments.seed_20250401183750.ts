import { DataSource } from 'typeorm';
import { Payment } from '../modules/payments/entities/payment.entity';
import { User } from '../modules/users/entities/user.entity';
import { PaymentStatus } from '../modules/payments/enums/payment-status.enum';
import { PaymentMethod } from '../modules/payments/enums/payment-method.enum';

export async function seedInitialPayments(dataSource: DataSource) {
  const paymentRepository = dataSource.getRepository(Payment);
  const userRepository = dataSource.getRepository(User);

  // Get the tenant user
  const tenant = await userRepository.findOne({
    where: { email: 'tenant@vive.com' },
    relations: ['property'],
  });

  if (!tenant || !tenant.property) {
    console.log('Tenant or property not found. Skipping payment seeding.');
    return;
  }

  // Check if payments already exist
  const existingPayments = await paymentRepository.find({
    where: { tenant: { id: tenant.id } },
  });

  if (existingPayments.length > 0) {
    console.log('Payments already exist for tenant. Skipping payment seeding.');
    return;
  }

  // Create sample payments
  const payments = [
    {
      amount: tenant.property.rentAmount,
      paymentMethod: PaymentMethod.BANK_TRANSFER,
      status: PaymentStatus.COMPLETED,
      dueDate: new Date(),
      paidDate: new Date(),
      description: 'Monthly rent payment',
    },
    {
      amount: tenant.property.rentAmount,
      paymentMethod: PaymentMethod.ZELLE,
      status: PaymentStatus.PENDING,
      dueDate: new Date(),
      description: 'Upcoming rent payment',
    },
  ];

  for (const paymentData of payments) {
    const payment = paymentRepository.create({
      ...paymentData,
      tenant,
      property: tenant.property,
    });

    await paymentRepository.save(payment);
  }

  console.log('Sample payments created successfully for tenant');
} 