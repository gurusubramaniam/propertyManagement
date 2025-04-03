import { Module } from '@nestjs/common';
import { TenantsController } from './tenants.controller';
import { TenantsService } from './tenants.service';
import { UsersModule } from '../users/users.module';
import { PaymentsModule } from '../payments/payments.module';
import { PropertiesModule } from '../properties/properties.module';

@Module({
  imports: [UsersModule, PaymentsModule, PropertiesModule],
  controllers: [TenantsController],
  providers: [TenantsService],
})
export class TenantsModule {} 