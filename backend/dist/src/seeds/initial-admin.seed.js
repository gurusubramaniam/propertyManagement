"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.seedInitialUsers = seedInitialUsers;
const user_entity_1 = require("../modules/users/entities/user.entity");
const user_entity_2 = require("../modules/users/entities/user.entity");
const bcrypt = require("bcrypt");
async function seedInitialUsers(dataSource) {
    const userRepository = dataSource.getRepository(user_entity_1.User);
    const existingAdmin = await userRepository.findOne({
        where: { email: 'admin@vive.com' }
    });
    if (!existingAdmin) {
        const hashedPassword = await bcrypt.hash('admin123', 10);
        const adminUser = userRepository.create({
            email: 'admin@vive.com',
            password: hashedPassword,
            firstName: 'Admin',
            lastName: 'User',
            role: user_entity_2.UserRole.ADMIN,
            phoneNumber: '1234567890',
            isActive: true
        });
        await userRepository.save(adminUser);
        console.log('Initial admin user created successfully');
    }
    else {
        console.log('Admin user already exists');
    }
    const existingTenant = await userRepository.findOne({
        where: { email: 'tenant@vive.com' }
    });
    if (!existingTenant) {
        const hashedPassword = await bcrypt.hash('tenant123', 10);
        const tenantUser = userRepository.create({
            email: 'tenant@vive.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Doe',
            role: user_entity_2.UserRole.TENANT,
            phoneNumber: '9876543210',
            isActive: true
        });
        await userRepository.save(tenantUser);
        console.log('Initial tenant user created successfully');
    }
    else {
        console.log('Tenant user already exists');
    }
}
//# sourceMappingURL=initial-admin.seed.js.map