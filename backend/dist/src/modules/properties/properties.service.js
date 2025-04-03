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
exports.PropertiesService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const property_entity_1 = require("./entities/property.entity");
const user_entity_1 = require("../users/entities/user.entity");
let PropertiesService = class PropertiesService {
    propertiesRepository;
    userRepository;
    constructor(propertiesRepository, userRepository) {
        this.propertiesRepository = propertiesRepository;
        this.userRepository = userRepository;
    }
    async create(createPropertyDto) {
        const property = this.propertiesRepository.create(createPropertyDto);
        return this.propertiesRepository.save(property);
    }
    async findAll() {
        return this.propertiesRepository.find();
    }
    async findOne(id) {
        const property = await this.propertiesRepository.findOne({ where: { id } });
        if (!property) {
            throw new common_1.NotFoundException(`Property with ID ${id} not found`);
        }
        return property;
    }
    async update(id, updatePropertyDto) {
        const property = await this.findOne(id);
        Object.assign(property, updatePropertyDto);
        return this.propertiesRepository.save(property);
    }
    async remove(id) {
        const property = await this.findOne(id);
        await this.propertiesRepository.remove(property);
    }
    async getTenantLeaseInfo(userId) {
        const user = await this.userRepository.findOne({
            where: { id: userId, role: user_entity_1.UserRole.TENANT },
            relations: ['property'],
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found or is not a tenant');
        }
        if (!user.property) {
            throw new common_1.NotFoundException('Tenant does not have an assigned property');
        }
        if (!user.leaseStartDate || !user.leaseEndDate) {
            throw new common_1.NotFoundException('Tenant lease information is incomplete');
        }
        const property = user.property;
        return {
            propertyName: property.name,
            address: property.address,
            leaseStartDate: user.leaseStartDate,
            leaseEndDate: user.leaseEndDate,
            rentAmount: property.rentAmount,
            nextPaymentDue: this.calculateNextPaymentDue(user.leaseStartDate),
        };
    }
    calculateNextPaymentDue(leaseStartDate) {
        const today = new Date();
        const leaseStart = new Date(leaseStartDate);
        const monthsSinceLeaseStart = (today.getFullYear() - leaseStart.getFullYear()) * 12 +
            (today.getMonth() - leaseStart.getMonth());
        const nextPaymentDue = new Date(today.getFullYear(), today.getMonth() + 1, 1);
        return nextPaymentDue;
    }
    async assignTenant(propertyId, tenantId, leaseStartDate, leaseEndDate) {
        const property = await this.findOne(propertyId);
        const tenant = await this.userRepository.findOne({
            where: { id: tenantId, role: user_entity_1.UserRole.TENANT },
        });
        if (!tenant) {
            throw new common_1.NotFoundException('Tenant not found');
        }
        tenant.property = property;
        tenant.leaseStartDate = leaseStartDate;
        tenant.leaseEndDate = leaseEndDate;
        return this.userRepository.save(tenant);
    }
};
exports.PropertiesService = PropertiesService;
exports.PropertiesService = PropertiesService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(property_entity_1.Property)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], PropertiesService);
//# sourceMappingURL=properties.service.js.map