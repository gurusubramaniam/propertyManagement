"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialPayments = seedInitialPayments;
const payment_entity_1 = require("../modules/payments/entities/payment.entity");
const user_entity_1 = require("../modules/users/entities/user.entity");
async function seedInitialPayments(dataSource) {
    const paymentRepository = dataSource.getRepository(payment_entity_1.Payment);
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const tenant = await userRepository.findOne({
        where: { email: 'tenant@vive.com' },
        relations: ['property'],
    });
    if (!tenant || !tenant.property) {
        console.log('Tenant or property not found. Skipping payment seeding.');
        return;
    }
    const existingPayments = await paymentRepository.find({
        where: { tenant: { id: tenant.id } },
    });
    if (existingPayments.length > 0) {
        console.log('Payments already exist for tenant. Skipping payment seeding.');
        return;
    }
    const payments = [
        {
            amount: tenant.property.rentAmount,
            paymentMethod: payment_entity_1.PaymentMethod.BANK_TRANSFER,
            status: payment_entity_1.PaymentStatus.COMPLETED,
            dueDate: new Date(),
            paidDate: new Date(),
            notes: 'Monthly rent payment',
        },
        {
            amount: tenant.property.rentAmount,
            paymentMethod: payment_entity_1.PaymentMethod.ZELLE,
            status: payment_entity_1.PaymentStatus.PENDING,
            dueDate: new Date(),
            notes: 'Upcoming rent payment',
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
//# sourceMappingURL=initial-payments.seed.js.map