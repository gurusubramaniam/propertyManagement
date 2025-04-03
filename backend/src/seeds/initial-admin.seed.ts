import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserRole } from '../modules/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedInitialUsers(dataSource: DataSource) {
    const userRepository = dataSource.getRepository(User);
    
    // Check if admin already exists
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
            role: UserRole.ADMIN,
            phoneNumber: '1234567890',
            isActive: true
        });

        await userRepository.save(adminUser);
        console.log('Initial admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }

    // Check if tenant already exists
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
            role: UserRole.TENANT,
            phoneNumber: '9876543210',
            isActive: true
        });

        await userRepository.save(tenantUser);
        console.log('Initial tenant user created successfully');
    } else {
        console.log('Tenant user already exists');
    }
} 