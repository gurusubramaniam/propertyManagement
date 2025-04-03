import { DataSource } from 'typeorm';
import { User } from '../modules/users/entities/user.entity';
import { UserRole } from '../modules/users/enums/user-role.enum';
import * as bcrypt from 'bcrypt';

export async function seedInitialAdmin(dataSource: DataSource) {
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
            phone: '1234567890'
        });

        await userRepository.save(adminUser);
        console.log('Initial admin user created successfully');
    } else {
        console.log('Admin user already exists');
    }
} 