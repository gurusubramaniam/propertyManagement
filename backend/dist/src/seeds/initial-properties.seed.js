"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialProperties = seedInitialProperties;
const property_entity_1 = require("../modules/properties/entities/property.entity");
const user_entity_1 = require("../modules/users/entities/user.entity");
const property_type_enum_1 = require("../modules/properties/enums/property-type.enum");
async function seedInitialProperties(dataSource) {
    const propertyRepository = dataSource.getRepository(property_entity_1.Property);
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const tenant = await userRepository.findOne({
        where: { email: 'tenant@vive.com' },
    });
    if (!tenant) {
        console.log('Tenant not found. Skipping property seeding.');
        return;
    }
    const existingProperties = await propertyRepository.find();
    if (existingProperties.length > 0) {
        console.log('Properties already exist. Skipping property seeding.');
        return;
    }
    const property = propertyRepository.create({
        name: 'Sunset Apartments',
        address: '123 Sunset Blvd',
        city: 'Los Angeles',
        state: 'CA',
        zipCode: '90028',
        type: property_type_enum_1.PropertyType.APARTMENT,
        rentAmount: 2500,
        bedrooms: 2,
        bathrooms: 2,
        squareFootage: 1200,
        description: 'Beautiful apartment in the heart of Los Angeles',
        amenities: 'Pool, Gym, Parking',
        isActive: true,
    });
    const savedProperty = await propertyRepository.save(property);
    console.log('Sample property created successfully');
    const leaseStartDate = new Date();
    const leaseEndDate = new Date();
    leaseEndDate.setFullYear(leaseEndDate.getFullYear() + 1);
    tenant.property = savedProperty;
    tenant.leaseStartDate = leaseStartDate;
    tenant.leaseEndDate = leaseEndDate;
    await userRepository.save(tenant);
    console.log('Tenant assigned to property successfully');
}
//# sourceMappingURL=initial-properties.seed.js.map