import { PropertyType } from '../enums/property-type.enum';
export declare class CreatePropertyDto {
    name: string;
    address: string;
    city: string;
    state: string;
    zipCode: string;
    type: PropertyType;
    price: number;
    rentAmount: number;
    bedrooms: number;
    bathrooms: number;
    squareFootage: number;
    description?: string;
    amenities?: string;
    images?: string;
    status?: string;
}
