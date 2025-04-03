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
exports.CreatePaymentResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const payment_entity_1 = require("../entities/payment.entity");
class CreatePaymentResponseDto {
    message;
    payment;
}
exports.CreatePaymentResponseDto = CreatePaymentResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'Success message',
        example: 'Payment initiated successfully',
    }),
    __metadata("design:type", String)
], CreatePaymentResponseDto.prototype, "message", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
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
                enum: payment_entity_1.PaymentMethod,
                description: 'Method used for the payment',
                example: payment_entity_1.PaymentMethod.BANK_TRANSFER,
            },
            transactionId: {
                type: 'string',
                description: 'Unique transaction identifier',
                example: 'PAY-1710931200000-x7f9q2',
            },
            status: {
                type: 'string',
                enum: payment_entity_1.PaymentStatus,
                description: 'Status of the payment',
                example: payment_entity_1.PaymentStatus.PENDING,
            },
        },
    }),
    __metadata("design:type", Object)
], CreatePaymentResponseDto.prototype, "payment", void 0);
//# sourceMappingURL=create-payment.response.dto.js.map