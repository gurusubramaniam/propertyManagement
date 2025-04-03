# Swagger/OpenAPI Documentation Setup

This document explains how to set up and maintain API documentation for the backend service using Swagger/OpenAPI.

## Installation

The backend uses `@nestjs/swagger` for API documentation. It's already included in the project dependencies:

```json
{
  "dependencies": {
    "@nestjs/swagger": "^7.0.0"
  }
}
```

## Configuration

### 1. Main Application Setup

In `backend/src/main.ts`:

```typescript
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = new DocumentBuilder()
    .setTitle('Vive Real Estate API')
    .setDescription('API documentation for the Vive Real Estate backend service')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3001);
}
bootstrap();
```

### 2. DTO Decorators

Use Swagger decorators in your DTOs:

```typescript
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'User email address',
    example: 'user@example.com'
  })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123'
  })
  password: string;
}
```

### 3. Controller Decorators

Add Swagger decorators to your controllers:

```typescript
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UsersController {
  @Post()
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createUser(@Body() createUserDto: CreateUserDto) {
    // Implementation
  }
}
```

## Documentation Best Practices

1. **Descriptive Properties**
   - Use clear descriptions
   - Include examples
   - Specify data types

2. **Response Documentation**
   - Document success responses
   - Document error responses
   - Include status codes

3. **Authentication**
   - Document auth requirements
   - Show token usage
   - Include security schemes

## Example Documentation

### User Module

```typescript
@ApiTags('users')
@Controller('users')
export class UsersController {
  @Get()
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({
    status: 200,
    description: 'Returns all users',
    type: [UserDto]
  })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async findAll() {
    // Implementation
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get user by ID' })
  @ApiResponse({
    status: 200,
    description: 'Returns a user',
    type: UserDto
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async findOne(@Param('id') id: string) {
    // Implementation
  }
}
```

### Property Module

```typescript
@ApiTags('properties')
@Controller('properties')
export class PropertiesController {
  @Post()
  @ApiOperation({ summary: 'Create a new property' })
  @ApiResponse({
    status: 201,
    description: 'Property created successfully',
    type: PropertyDto
  })
  @ApiResponse({ status: 400, description: 'Invalid input' })
  async createProperty(@Body() createPropertyDto: CreatePropertyDto) {
    // Implementation
  }
}
```

## Accessing Documentation

1. **Development**
   - URL: `http://localhost:3001/api`
   - Swagger UI interface
   - Interactive API testing

2. **Production**
   - URL: `https://api.viverealestate.com/api`
   - Protected access
   - Read-only mode

## Generating Documentation

```bash
# Generate OpenAPI specification
npm run swagger:generate

# The specification will be saved to:
# backend/swagger-spec.json
```

## Testing Documentation

1. **Validate Documentation**
   ```bash
   npm run swagger:validate
   ```

2. **Check Coverage**
   ```bash
   npm run swagger:coverage
   ```

## Maintenance

1. **Regular Updates**
   - Update documentation with new endpoints
   - Review and update examples
   - Check response types

2. **Version Control**
   - Keep documentation in sync with code
   - Review changes in PRs
   - Update version numbers

3. **Quality Checks**
   - Validate OpenAPI spec
   - Check for missing documentation
   - Review security documentation 