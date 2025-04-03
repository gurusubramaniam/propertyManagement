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
exports.PaymentInfoResponseDto = void 0;
const swagger_1 = require("@nestjs/swagger");
class PaymentInfoResponseDto {
    amountDue;
    propertyName;
    propertyAddress;
}
exports.PaymentInfoResponseDto = PaymentInfoResponseDto;
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The total amount due',
        example: 1500.0,
    }),
    __metadata("design:type", Number)
], PaymentInfoResponseDto.prototype, "amountDue", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The name of the property',
        example: 'Sunset Apartments',
    }),
    __metadata("design:type", String)
], PaymentInfoResponseDto.prototype, "propertyName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({
        description: 'The address of the property',
        example: '123 Main St, City, State 12345',
    }),
    __metadata("design:type", String)
], PaymentInfoResponseDto.prototype, "propertyAddress", void 0);
//# sourceMappingURL=payment-info.response.dto.js.map