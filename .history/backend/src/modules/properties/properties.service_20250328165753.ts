import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from './entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertiesRepository: Repository<Property>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertiesRepository.create(createPropertyDto);
    return this.propertiesRepository.save(property);
  }

  async findAll(): Promise<Property[]> {
    return this.propertiesRepository.find();
  }

  async findOne(id: string): Promise<Property> {
    const property = await this.propertiesRepository.findOne({ where: { id } });
    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
    return property;
  }

  async update(id: string, updatePropertyDto: UpdatePropertyDto): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, updatePropertyDto);
    return this.propertiesRepository.save(property);
  }

  async remove(id: string): Promise<void> {
    const property = await this.findOne(id);
    await this.propertiesRepository.remove(property);
  }

  async getTenantLeaseInfo(userId: string) {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['property'],
    });

    if (!user || !user.property) {
      throw new NotFoundException('Tenant property information not found');
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

  private calculateNextPaymentDue(leaseStartDate: Date): Date {
    const today = new Date();
    const leaseStart = new Date(leaseStartDate);
    
    // Calculate months since lease start
    const monthsSinceLeaseStart = (today.getFullYear() - leaseStart.getFullYear()) * 12 + 
                                 (today.getMonth() - leaseStart.getMonth());
    
    // Calculate next payment due date (1st of next month)
    const nextPaymentDue = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    
    return nextPaymentDue;
  }
}
