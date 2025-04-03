import { User } from '../../users/entities/user.entity';
import { PropertyType } from '../enums/property-type.enum';
export declare class Property {
    id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    type: PropertyType;
    rentAmount: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    description: string;
    amenities: string;
    images: string;
    isActive: boolean;
    tenants: User[];
    createdAt: Date;
    updatedAt: Date;
}
