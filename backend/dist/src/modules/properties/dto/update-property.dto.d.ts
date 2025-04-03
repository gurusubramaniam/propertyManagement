import { PropertyType } from '../enums/property-type.enum';
export declare class UpdatePropertyDto {
    name?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    type?: PropertyType;
    rentAmount?: number;
    bedrooms?: number;
    bathrooms?: number;
    squareFootage?: number;
    description?: string;
    amenities?: string;
    images?: string;
    isActive?: boolean;
}
