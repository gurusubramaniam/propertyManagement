import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { Property } from '../../properties/entities/property.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum UserRole {
  ADMIN = 'admin',
  TENANT = 'tenant',
  LANDLORD = 'landlord',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.TENANT,
  })
  role: UserRole;

  @Column({ nullable: true })
  phoneNumber: string;

  @Column({ nullable: true })
  emergencyContact: string;

  @Column({ nullable: true })
  emergencyContactPhone: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Property, (property) => property.owner)
  properties: Property[];

  @OneToMany(() => Payment, (payment) => payment.tenant)
  payments: Payment[];

  @ManyToOne(() => Property, { nullable: true })
  property: Property;

  @Column({ type: 'date', nullable: true })
  leaseStartDate: Date;

  @Column({ type: 'date', nullable: true })
  leaseEndDate: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

// Export type alias for User entity
export type UserEntity = User;
