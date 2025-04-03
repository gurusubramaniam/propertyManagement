import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Payment } from '../../payments/entities/payment.entity';

export enum PropertyType {
  HOUSE = 'house',
  APARTMENT = 'apartment',
  CONDO = 'condo',
  TOWNHOUSE = 'townhouse',
  LAND = 'land',
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

  @Column({
    type: 'enum',
    enum: PropertyType,
    default: PropertyType.HOUSE,
  })
  type: PropertyType;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  rentAmount: number;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  squareFootage: number;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  amenities: string;

  @Column({ nullable: true })
  images: string;

  @Column({ default: 'available' })
  status: string;

  @ManyToOne(() => User, (user) => user.properties)
  owner: User;

  @OneToMany(() => Payment, (payment) => payment.property)
  payments: Payment[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
