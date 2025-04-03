import { Property } from '../../properties/entities/property.entity';
export declare enum UserRole {
    ADMIN = "admin",
    TENANT = "tenant",
    LANDLORD = "landlord"
}
export declare class User {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    role: UserRole;
    phoneNumber: string;
    emergencyContact: string;
    emergencyContactPhone: string;
    isActive: boolean;
    property: Property;
    leaseStartDate: Date;
    leaseEndDate: Date;
    createdAt: Date;
    updatedAt: Date;
}
export type UserEntity = User;
