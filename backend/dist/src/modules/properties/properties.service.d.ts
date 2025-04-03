import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../users/entities/user.entity';
export declare class PropertiesService {
    private propertiesRepository;
    private readonly userRepository;
    constructor(propertiesRepository: Repository<Property>, userRepository: Repository<User>);
    create(createPropertyDto: CreatePropertyDto): Promise<Property>;
    findAll(): Promise<Property[]>;
    findOne(id: string): Promise<Property>;
    update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property>;
    remove(id: string): Promise<void>;
    getTenantLeaseInfo(userId: string): Promise<{
        propertyName: string;
        address: string;
        leaseStartDate: Date;
        leaseEndDate: Date;
        rentAmount: number;
        nextPaymentDue: Date;
    }>;
    private calculateNextPaymentDue;
    assignTenant(propertyId: string, tenantId: string, leaseStartDate: Date, leaseEndDate: Date): Promise<User>;
}
