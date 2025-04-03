import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';
import { PropertyType } from '../enums/property-type.enum';

export class UpdatePropertyDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  zipCode?: string;

  @IsEnum(PropertyType)
  @IsOptional()
  type?: PropertyType;

  @IsNumber()
  @IsOptional()
  rentAmount?: number;

  @IsNumber()
  @IsOptional()
  bedrooms?: number;

  @IsNumber()
  @IsOptional()
  bathrooms?: number;

  @IsNumber()
  @IsOptional()
  squareFootage?: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  amenities?: string;

  @IsString()
  @IsOptional()
  images?: string;

  @IsOptional()
  isActive?: boolean;
} 