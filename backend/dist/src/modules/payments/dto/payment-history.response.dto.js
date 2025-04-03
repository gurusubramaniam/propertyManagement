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
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaymentHistoryResponseDto = exports.PaymentHistoryItemDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const payment_entity_1 = require("../entities/payment.entity");
class PaymentHistoryItemDto {
    id;
    date;
    amount;
    status;
    paymentMethod;
    propertyName;
    invoiceUrl;
}
exports.PaymentHistoryItemDto = PaymentHistoryItemDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Unique identifier of the payment',
        example: '123e4567-e89b-12d3-a456-426614174000',
    }),
    __metadata("design:type", String)
], PaymentHistoryItemDto.prototype, "id", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Date when the payment was created',
        example: '2024-03-20T10:00:00Z',
    }),
    __metadata("design:type", Date)
], PaymentHistoryItemDto.prototype, "date", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Amount of the payment',
        example: 1500.0,
    }),
    __metadata("design:type", Number)
], PaymentHistoryItemDto.prototype, "amount", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Status of the payment',
        enum: payment_entity_1.PaymentStatus,
        example: payment_entity_1.PaymentStatus.COMPLETED,
    }),
    __metadata("design:type", String)
], PaymentHistoryItemDto.prototype, "status", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Method used for the payment',
        enum: payment_entity_1.PaymentMethod,
        example: payment_entity_1.PaymentMethod.BANK_TRANSFER,
    }),
    __metadata("design:type", String)
], PaymentHistoryItemDto.prototype, "paymentMethod", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Name of the property',
        example: 'Sunset Apartments',
    }),
    __metadata("design:type", String)
], PaymentHistoryItemDto.prototype, "propertyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'URL to download the payment invoice',
        example: '/api/payments/123e4567-e89b-12d3-a456-426614174000/invoice',
    }),
    __metadata("design:type", String)
], PaymentHistoryItemDto.prototype, "invoiceUrl", void 0);
class PaymentHistoryResponseDto {
    payments;
}
exports.PaymentHistoryResponseDto = PaymentHistoryResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        type: [PaymentHistoryItemDto],
        description: 'List of payment history items',
    }),
    __metadata("design:type", Array)
], PaymentHistoryResponseDto.prototype, "payments", void 0);
//# sourceMappingURL=payment-history.response.dto.js.map