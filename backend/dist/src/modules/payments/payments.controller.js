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
exports.PaymentsController = void 0;
const common_1 = require("@nestjs/common");
const payments_service_1 = require("./payments.service");
const create_payment_dto_1 = require("./dto/create-payment.dto");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const user_decorator_1 = require("../auth/decorators/user.decorator");
const swagger_1 = require("@nestjs/swagger");
let PaymentsController = class PaymentsController {
    paymentsService;
    constructor(paymentsService) {
        this.paymentsService = paymentsService;
    }
    async getTenantPaymentInfo(user) {
        return this.paymentsService.getTenantPaymentInfo(user.id);
    }
    async createPayment(user, createPaymentDto) {
        return this.paymentsService.createPayment(user.id, createPaymentDto);
    }
    async getTenantPaymentHistory(user) {
        return this.paymentsService.getTenantPaymentHistory(user.id);
    }
    async getTenantPayment(user, id) {
        return this.paymentsService.getTenantPayment(user.id, id);
    }
    async getAllPayments(user) {
        return this.paymentsService.getAllPayments(user);
    }
};
exports.PaymentsController = PaymentsController;
__decorate([
    (0, common_1.Get)('tenant/payment-info'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant payment information' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns tenant payment information',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found - Tenant or property not found',
    }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTenantPaymentInfo", null);
__decorate([
    (0, common_1.Post)('tenant/payment'),
    (0, swagger_1.ApiOperation)({ summary: 'Create a new payment' }),
    (0, swagger_1.ApiResponse)({
        status: 201,
        description: 'Payment created successfully',
    }),
    (0, swagger_1.ApiResponse)({
        status: 400,
        description: 'Bad Request - Invalid payment data',
    }),
    (0, swagger_1.ApiResponse)({
        status: 401,
        description: 'Unauthorized - User is not authenticated',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User is not a tenant',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Not Found - Tenant or property not found',
    }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, create_payment_dto_1.CreatePaymentDto]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "createPayment", null);
__decorate([
    (0, common_1.Get)('tenant/payment-history'),
    (0, swagger_1.ApiOperation)({ summary: 'Get tenant payment history' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns tenant payment history',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User is not a tenant',
    }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTenantPaymentHistory", null);
__decorate([
    (0, common_1.Get)('tenant/payment/:id'),
    (0, swagger_1.ApiOperation)({ summary: 'Get specific payment details' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns payment details',
    }),
    (0, swagger_1.ApiResponse)({
        status: 404,
        description: 'Payment not found',
    }),
    __param(0, (0, user_decorator_1.User)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getTenantPayment", null);
__decorate([
    (0, common_1.Get)(),
    (0, swagger_1.ApiOperation)({ summary: 'Get all payments (admin only)' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns all payments',
    }),
    (0, swagger_1.ApiResponse)({
        status: 403,
        description: 'Forbidden - User is not an admin',
    }),
    __param(0, (0, user_decorator_1.User)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], PaymentsController.prototype, "getAllPayments", null);
exports.PaymentsController = PaymentsController = __decorate([
    (0, swagger_1.ApiTags)('Tenant Payments'),
    (0, common_1.Controller)('payments'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:paramtypes", [payments_service_1.PaymentsService])
], PaymentsController);
//# sourceMappingURL=payments.controller.js.map