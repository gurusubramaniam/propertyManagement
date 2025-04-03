"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const payment_entity_1 = require("./entities/payment.entity");
const user_entity_1 = require("../users/entities/user.entity");
const property_entity_1 = require("../properties/entities/property.entity");
let PaymentsService = class PaymentsService {
    paymentsRepository;
    usersRepository;
    propertiesRepository;
    constructor(paymentsRepository, usersRepository, propertiesRepository) {
        this.paymentsRepository = paymentsRepository;
        this.usersRepository = usersRepository;
        this.propertiesRepository = propertiesRepository;
    }
    async getAllPayments(user) {
        if (user.role !== user_entity_1.UserRole.ADMIN) {
            throw new common_1.ForbiddenException('Only admins can access all payments');
        }
        const payments = await this.paymentsRepository.find({
            relations: ['tenant', 'property'],
            order: { createdAt: 'DESC' },
        });
        return payments.map((payment) => ({
            id: payment.id,
            amount: payment.amount,
            date: payment.createdAt,
            status: payment.status,
            tenantName: payment.tenant.firstName,
            propertyName: payment.property.name,
        }));
    }
    async getTenantPaymentInfo(tenantId) {
        const tenant = await this.usersRepository.findOne({
            where: { id: tenantId, role: user_entity_1.UserRole.TENANT },
            relations: ['property'],
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const property = tenant.property;
        if (!property) {
            throw new common_1.NotFoundException('No property found for tenant');
        }
        const pendingPayments = await this.paymentsRepository.find({
            where: {
                tenant: { id: tenantId },
                status: payment_entity_1.PaymentStatus.PENDING,
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
    async createPayment(tenantId, createPaymentDto) {
        const tenant = await this.usersRepository.findOne({
            where: { id: tenantId, role: user_entity_1.UserRole.TENANT },
            relations: ['property'],
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        const property = tenant.property;
        if (!property) {
            throw new common_1.NotFoundException('No property found for tenant');
        }
        const payment = this.paymentsRepository.create({
            ...createPaymentDto,
            tenant,
            property,
            status: payment_entity_1.PaymentStatus.PENDING,
            dueDate: new Date(),
        });
        const savedPayment = await this.paymentsRepository.save(payment);
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
    async getTenantPaymentHistory(tenantId) {
        const payments = await this.paymentsRepository.find({
            where: { tenant: { id: tenantId } },
            relations: ['property'],
            order: { createdAt: 'DESC' },
        });
        return payments.map((payment) => ({
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
    async getTenantPayment(tenantId, paymentId) {
        const payment = await this.paymentsRepository.findOne({
            where: {
                id: paymentId,
                tenant: { id: tenantId },
            },
            relations: ['property'],
        });
        if (!payment) {
            throw new common_1.NotFoundException('Payment not found');
        }
        return {
            id: payment.id,
            amount: payment.amount,
            paymentMethod: payment.paymentMethod,
            status: payment.status,
            transactionId: payment.transactionId,
            dueDate: payment.dueDate,
            createdAt: payment.createdAt,
            propertyName: payment.property.name,
        };
    }
};
exports.PaymentsService = PaymentsService;
exports.PaymentsService = PaymentsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(payment_entity_1.Payment)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __param(2, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository,
        typeorm_2.Repository])
], PaymentsService);
//# sourceMappingURL=payments.service.js.map