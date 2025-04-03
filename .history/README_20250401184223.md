# Vive Real Estate Management System

A modern real estate management system built with Next.js, NestJS, and PostgreSQL.

## Features

- 🏠 Property Management
- 👥 Tenant Management
- 💰 Payment Processing
- 📊 Admin Dashboard
- 🔐 Secure Authentication
- 📱 Responsive Design

## Tech Stack

- **Frontend**: Next.js 15.2.4, React, TailwindCSS
- **Backend**: NestJS 11, TypeORM
- **Database**: PostgreSQL
- **Authentication**: JWT

## Prerequisites

- Node.js (v18 or higher)
- PostgreSQL (v14 or higher)
- npm or yarn

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/viverealestate.git
cd viverealestate
```

### 2. Database Setup

```bash
# Create the database
psql -U postgres -c "CREATE DATABASE vive_real_estate;"

# Enable UUID extension (required for our UUID primary keys)
psql -U postgres -d vive_real_estate -c "CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\";"
```

### 3. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env

# Update .env with your database credentials
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_NAME=vive_real_estate
JWT_SECRET=your-secret-key
```

### 4. Database Migrations

The application uses TypeORM for database management. Here are all the available migration commands:

```bash
# Generate a new migration
npm run migration:generate --name=YourMigrationName

# Run all pending migrations
npm run migration:run

# Revert the last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

#### Available Migrations

1. `CreateUsersTable1743195644723`
   - Creates the users table with role enum
   - Sets up basic user fields (email, password, name, etc.)

2. `CreatePropertiesTable1743195644724`
   - Creates the properties table with type enum
   - Sets up property fields and foreign key to users

3. `AddLeaseFieldsToUser1743195644725`
   - Modifies the properties table
   - Adds lease-related fields to users

4. `CreatePaymentsTable1743195644726`
   - Creates the payments table
   - Sets up payment method and status enums
   - Adds foreign keys to users and properties

### 5. Database Seeding

The application includes several seed scripts to set up initial data for testing and development. Running the seed script will create:

1. **Admin User**
   - Email: `admin@vive.com`
   - Password: `admin123`
   - Role: Admin
   - Full access to all admin features

2. **Test Tenant**
   - Email: `tenant@vive.com`
   - Password: `tenant123`
   - Role: Tenant
   - Name: John Doe
   - Phone: 987-654-3210

3. **Sample Property**
   - Name: Sunset Apartments
   - Address: 123 Sunset Blvd, Los Angeles, CA 90028
   - Type: Apartment
   - Rent: $2,500/month
   - Features: 2 bed, 2 bath, 1,200 sq ft
   - Amenities: Pool, Gym, Parking
   - Automatically assigned to the test tenant with a one-year lease

4. **Sample Payments**
   - A completed payment via bank transfer for the current month's rent ($2,500)
   - A pending payment via Zelle for the next month's rent ($2,500)

To run the seed script:

```bash
# Navigate to the backend directory
cd backend

# Run all seed scripts
npm run seed
```

The seed script will:
1. Check for existing data to prevent duplicates
2. Create the admin user if it doesn't exist
3. Create the tenant user if it doesn't exist
4. Create the sample property if it doesn't exist
5. Assign the tenant to the property with a one-year lease
6. Create sample payment records for the tenant

After running the seeds, you can log in with either:

**Admin Account:**
- Email: `admin@vive.com`
- Password: `admin123`

**Tenant Account:**
- Email: `tenant@vive.com`
- Password: `tenant123`

### 6. Start the Backend

```bash
# Start in development mode
npm run start:dev

# Start in production mode
npm run build
npm run start:prod
```

The backend will be available at `http://localhost:3001`

### 7. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

## Database Schema

The application uses the following main tables:

### Users
- UUID primary key
- Email (unique)
- Password (hashed)
- First Name
- Last Name
- Role (admin/owner/tenant)
- Phone Number
- Emergency Contact
- Emergency Contact Phone
- Property Reference
- Lease Start/End Dates

### Properties
- UUID primary key
- Name
- Address
- Rent Amount
- Status
- Owner Reference

### Payments
- UUID primary key
- Amount
- Payment Method (bank_transfer/zelle/venmo)
- Status (pending/completed/failed)
- Due Date
- Paid Date
- Tenant Reference
- Property Reference

## API Endpoints

### Authentication
- POST `/auth/login` - User login
- POST `/auth/reset-password` - Password reset
- GET `/auth/profile` - Get user profile

### Users
- POST `/users` - Create user
- GET `/users` - Get all users
- GET `/users/profile` - Get current user profile
- GET `/users/search/tenants` - Search tenants
- GET `/users/:id` - Get user by ID
- PATCH `/users/:id` - Update user
- DELETE `/users/:id` - Delete user

### Properties
- POST `/properties` - Create property
- GET `/properties` - Get all properties
- GET `/properties/:id` - Get property by ID
- PATCH `/properties/:id` - Update property
- DELETE `/properties/:id` - Delete property
- POST `/properties/:id/assign-tenant` - Assign tenant to property

### Payments
- GET `/payments` - Get all payments (admin only)
- GET `/payments/tenant/payment-info` - Get tenant payment info
- POST `/payments/tenant/payment` - Create payment
- GET `/payments/tenant/payment-history` - Get payment history
- GET `/payments/tenant/payment/:id` - Get specific payment

### Tenant Dashboard
- GET `/tenant/dashboard` - Get tenant dashboard data

## Development

### Database Management

#### Creating New Migrations

When you make changes to your entities, you can generate a new migration:

```bash
# Generate migration based on entity changes
npm run migration:generate --name=YourMigrationName

# Example: Adding a new field to users
npm run migration:generate --name=AddPhoneNumberToUser
```

#### Running Migrations

```bash
# Run all pending migrations
npm run migration:run

# Revert last migration
npm run migration:revert

# Show migration status
npm run migration:show
```

#### Database Seeding

```bash
# Run all seed scripts
npm run seed

# Run specific seed script
npm run seed:admin
```

### Common Issues and Solutions

1. **Migration Errors**
   - If you get "relation does not exist" errors, make sure to run migrations in order
   - Use `npm run migration:revert` to undo problematic migrations
   - Check the migration files in `src/migrations` for the correct order

2. **Database Connection Issues**
   - Verify PostgreSQL is running
   - Check database credentials in `.env`
   - Ensure database exists and UUID extension is enabled

3. **Seeding Issues**
   - If seeding fails, check the database connection
   - Verify the seed scripts are in the correct order
   - Check for any unique constraint violations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details 