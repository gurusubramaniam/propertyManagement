import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { PropertiesService } from './properties.service';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/decorators/user.decorator';
import { UserEntity } from '../users/entities/user.entity';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Properties')
@Controller('properties')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class PropertiesController {
  constructor(private readonly propertiesService: PropertiesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({
    status: 201,
    description: 'Property has been successfully created.',
  })
  async create(@Body() createPropertyDto: CreatePropertyDto) {
    return this.propertiesService.create(createPropertyDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all properties' })
  @ApiResponse({
    status: 200,
    description: 'Returns all properties.',
  })
  async findAll() {
    return this.propertiesService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get property by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns the property information.',
  })
  async findOne(@Param('id') id: string) {
    return this.propertiesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update property' })
  @ApiResponse({
    status: 200,
    description: 'Property has been successfully updated.',
  })
  async update(@Param('id') id: string, @Body() updatePropertyDto: UpdatePropertyDto) {
    return this.propertiesService.update(id, updatePropertyDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete property' })
  @ApiResponse({
    status: 200,
    description: 'Property has been successfully deleted.',
  })
  async remove(@Param('id') id: string) {
    return this.propertiesService.remove(id);
  }

  @Post(':id/assign-tenant')
  @ApiOperation({ summary: 'Assign a tenant to a property' })
  @ApiResponse({
    status: 200,
    description: 'Tenant has been successfully assigned to the property.',
  })
  async assignTenant(
    @Param('id') propertyId: string,
    @Body() body: { tenantId: string; leaseStartDate: string; leaseEndDate: string },
  ) {
    return this.propertiesService.assignTenant(
      propertyId,
      body.tenantId,
      new Date(body.leaseStartDate),
      new Date(body.leaseEndDate),
    );
  }
} 