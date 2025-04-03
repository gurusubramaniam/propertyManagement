import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum PropertyStatus {
  AVAILABLE = 'available',
  RENTED = 'rented',
  MAINTENANCE = 'maintenance',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  address: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  zipCode: string;

  @Column('decimal', { precision: 10, scale: 2 })
  rentAmount: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  securityDeposit: number;

  @Column('decimal', { precision: 10, scale: 2, nullable: true })
  lateFee: number;

  @Column({ type: 'date' })
  leaseStartDate: Date;

  @Column({ type: 'date' })
  leaseEndDate: Date;

  @Column({ default: true })
  isActive: boolean;

  @Column({
    type: 'enum',
    enum: PropertyStatus,
    default: PropertyStatus.AVAILABLE,
  })
  status: PropertyStatus;

  @Column()
  description: string;

  @Column('simple-array', { nullable: true })
  amenities: string[];

  @ManyToOne(() => User, user => user.properties)
  owner: User;

  @OneToMany(() => Payment, payment => payment.property)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
} 