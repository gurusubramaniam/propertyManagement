import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { PropertyType } from '../enums/property-type.enum';

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

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => User, (user) => user.property)
  tenants: User[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
