# Vive Real Estate Application Workflow

This document outlines the complete workflow of the Vive Real Estate application, including user management, authentication, property management, and payment processing.

## User Management

### 1. User Roles
The application supports three user roles:
- **Admin**: Manages properties, tenants, and payments
- **Tenant**: Views and pays for their rented property
- **Property Manager**: Manages specific properties

### 2. Account Creation

#### Admin Account
1. Created through database seeding or direct database insertion
2. Has full access to all system features
3. Can create other admin accounts and property managers

#### Property Manager Account
1. Created by an admin through the admin dashboard
2. API Endpoint: `POST /admin/property-managers`
3. Required fields:
   ```json
   {
     "email": "manager@example.com",
     "password": "secure_password",
     "firstName": "John",
     "lastName": "Doe",
     "phone": "+1234567890"
   }
   ```

#### Tenant Account
1. Created by an admin or property manager
2. API Endpoint: `POST /admin/tenants`
3. Required fields:
   ```json
   {
     "email": "tenant@example.com",
     "password": "secure_password",
     "firstName": "Jane",
     "lastName": "Smith",
     "phone": "+1234567890",
     "propertyId": "property-uuid"
   }
   ```

## Authentication

### 1. Login Process
1. API Endpoint: `POST /auth/login`
2. Request body:
   ```json
   {
     "email": "user@example.com",
     "password": "user_password"
   }
   ```
3. Response:
   ```json
   {
     "access_token": "jwt_token",
     "user": {
       "id": "user-uuid",
       "email": "user@example.com",
       "role": "tenant|admin|property_manager",
       "firstName": "John",
       "lastName": "Doe"
     }
   }
   ```

### 2. Password Reset
1. Request Reset:
   - API Endpoint: `POST /auth/forgot-password`
   - Request body: `{ "email": "user@example.com" }`
2. Reset Password:
   - API Endpoint: `POST /auth/reset-password`
   - Request body:
     ```json
     {
       "token": "reset_token",
       "password": "new_password"
     }
     ```

## Property Management

### 1. Adding New Properties
1. API Endpoint: `POST /admin/properties`
2. Required fields:
   ```json
   {
     "name": "Sunset Apartments",
     "address": "123 Main St",
     "city": "San Francisco",
     "state": "CA",
     "zipCode": "94105",
     "type": "apartment",
     "rentAmount": 2500,
     "bedrooms": 2,
     "bathrooms": 1,
     "squareFootage": 1000,
     "description": "Beautiful apartment in downtown",
     "amenities": ["parking", "gym", "pool"],
     "propertyManagerId": "manager-uuid"
   }
   ```

### 2. Property Operations
1. List Properties:
   - API Endpoint: `GET /admin/properties`
   - Query parameters:
     - `status`: active|maintenance|rented
     - `type`: apartment|house|condo
     - `minPrice`: minimum rent amount
     - `maxPrice`: maximum rent amount

2. Update Property:
   - API Endpoint: `PATCH /admin/properties/:id`
   - Can update any property field

3. Delete Property:
   - API Endpoint: `DELETE /admin/properties/:id`
   - Only available for properties without active tenants

## Payment Processing

### 1. Payment Methods
Supported payment methods:
- Bank Transfer
- Zelle
- Venmo

### 2. Payment Flow

#### For Tenants
1. View Payment Information:
   - API Endpoint: `GET /tenant/payment-info`
   - Shows current amount due and property details

2. Make Payment:
   - API Endpoint: `POST /tenant/payments`
   - Request body:
     ```json
     {
       "amount": 2500,
       "paymentMethod": "bank_transfer"
     }
     ```

3. View Payment History:
   - API Endpoint: `GET /tenant/payment-history`
   - Shows all past payments with status

#### For Admins
1. View All Payments:
   - API Endpoint: `GET /admin/payments`
   - Query parameters:
     - `status`: pending|completed|failed
     - `startDate`: filter by date range
     - `endDate`: filter by date range

2. Update Payment Status:
   - API Endpoint: `PATCH /admin/payments/:id`
   - Update payment status and add notes

## Database Structure

### 1. Main Entities
1. **User**
   - id: UUID
   - email: string
   - password: string (hashed)
   - role: enum
   - firstName: string
   - lastName: string
   - phone: string
   - createdAt: Date
   - updatedAt: Date

2. **Property**
   - id: UUID
   - name: string
   - address: string
   - city: string
   - state: string
   - zipCode: string
   - type: enum
   - rentAmount: number
   - bedrooms: number
   - bathrooms: number
   - squareFootage: number
   - description: string
   - amenities: string[]
   - status: enum
   - propertyManager: User
   - tenants: User[]
   - createdAt: Date
   - updatedAt: Date

3. **Payment**
   - id: UUID
   - amount: number
   - paymentMethod: enum
   - status: enum
   - transactionId: string
   - tenant: User
   - property: Property
   - dueDate: Date
   - createdAt: Date
   - updatedAt: Date

## Security Measures

1. **Authentication**
   - JWT-based authentication
   - Token expiration
   - Refresh token mechanism

2. **Authorization**
   - Role-based access control
   - Resource-level permissions
   - API endpoint protection

3. **Data Protection**
   - Password hashing
   - Input validation
   - SQL injection prevention

## Development Setup

1. **Environment Variables**
   Required environment variables:
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/vive_realestate
   JWT_SECRET=your_jwt_secret
   JWT_EXPIRATION=24h
   SMTP_HOST=smtp.example.com
   SMTP_PORT=587
   SMTP_USER=your_smtp_user
   SMTP_PASS=your_smtp_password
   ```

2. **Database Setup**
   ```bash
   # Run migrations
   npm run typeorm migration:run

   # Seed initial data
   npm run seed
   ```

3. **Starting the Application**
   ```bash
   # Development
   npm run start:dev

   # Production
   npm run build
   npm run start:prod
   ```

## Testing

1. **Unit Tests**
   ```bash
   npm run test
   ```

2. **E2E Tests**
   ```bash
   npm run test:e2e
   ```

3. **API Testing**
   - Use Swagger UI at `/api` endpoint
   - Postman collection available in `/docs/postman`

## Deployment

1. **Prerequisites**
   - Node.js 18+
   - PostgreSQL 14+
   - Redis (optional, for caching)

2. **Deployment Steps**
   1. Build the application
   2. Set up environment variables
   3. Run database migrations
   4. Start the application
   5. Configure reverse proxy (Nginx)
   6. Set up SSL certificates 