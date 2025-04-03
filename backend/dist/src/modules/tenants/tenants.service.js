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
var TenantsService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TenantsService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const payments_service_1 = require("../payments/payments.service");
const properties_service_1 = require("../properties/properties.service");
let TenantsService = TenantsService_1 = class TenantsService {
    usersService;
    paymentsService;
    propertiesService;
    logger = new common_1.Logger(TenantsService_1.name);
    constructor(usersService, paymentsService, propertiesService) {
        this.usersService = usersService;
        this.paymentsService = paymentsService;
        this.propertiesService = propertiesService;
    }
    async getDashboard(userId) {
        this.logger.log(`Getting dashboard data for user: ${userId}`);
        const user = await this.usersService.findOne(userId);
        this.logger.log(`Found user: ${JSON.stringify(user)}`);
        if (!user || user.role !== 'tenant') {
            this.logger.warn(`User ${userId} is not a tenant`);
            throw new common_1.ForbiddenException('User is not a tenant');
        }
        try {
            const [leaseInfo, paymentHistory] = await Promise.all([
                this.propertiesService.getTenantLeaseInfo(userId),
                this.paymentsService.getTenantPaymentHistory(userId),
            ]);
            this.logger.log(`Successfully fetched dashboard data for user: ${userId}`);
            return {
                leaseInfo,
                paymentHistory,
            };
        }
        catch (error) {
            this.logger.error(`Error fetching dashboard data for user: ${userId}`, error);
            throw error;
        }
    }
};
exports.TenantsService = TenantsService;
exports.TenantsService = TenantsService = TenantsService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        payments_service_1.PaymentsService,
        properties_service_1.PropertiesService])
], TenantsService);
//# sourceMappingURL=tenants.service.js.map