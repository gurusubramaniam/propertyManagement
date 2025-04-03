import { DataSource } from 'typeorm';
import { Property } from '../modules/properties/entities/property.entity';
import { User } from '../modules/users/entities/user.entity';
import { PropertyType } from '../modules/properties/enums/property-type.enum';

export async function seedInitialProperties(dataSource: DataSource) {
  const propertyRepository = dataSource.getRepository(Property);
  const userRepository = dataSource.getRepository(User);

  // Get the tenant user
  const tenant = await userRepository.findOne({
    where: { email: 'tenant@vive.com' },
  });

  if (!tenant) {
    console.log('Tenant not found. Skipping property seeding.');
    return;
  }

  // Check if properties already exist
  const existingProperties = await propertyRepository.find();
  if (existingProperties.length > 0) {
    console.log('Properties already exist. Skipping property seeding.');
    return;
  }

  // Create a sample property
  const property = propertyRepository.create({
    name: 'Sunset Apartments',
    address: '123 Sunset Blvd',
    city: 'Los Angeles',
    state: 'CA',
    zipCode: '90028',
    type: PropertyType.APARTMENT,
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

  // Assign tenant to the property
  const leaseStartDate = new Date();
  const leaseEndDate = new Date();
  leaseEndDate.setFullYear(leaseEndDate.getFullYear() + 1);

  tenant.property = savedProperty;
  tenant.leaseStartDate = leaseStartDate;
  tenant.leaseEndDate = leaseEndDate;

  await userRepository.save(tenant);
  console.log('Tenant assigned to property successfully');
} 