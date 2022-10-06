import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { StateProvince } from '../state-provinces/state-province.entity';
import { Exclude } from 'class-transformer';

@Entity('customers')
export class Customer {
  @Exclude({ toClassOnly: true })
  @PrimaryGeneratedColumn()
  id: number;

  @IsNotEmpty()
  @Column({ length: 255 })
  firstName: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  lastName: string;

  @IsEmail()
  @Column({ length: 255 })
  @Index('customers_email_key', { unique: true })
  email: string;

  @IsNotEmpty()
  @Column({ length: 255 })
  address: string;

  @Column({ length: 255, nullable: true })
  address2: string;

  @IsNotEmpty()
  @Column({ length: 30 })
  postalCode: string;

  @IsNotEmpty()
  @ManyToOne(() => StateProvince, null, { eager: true, nullable: false })
  @JoinColumn({ name: 'state_province_id' })
  stateProvince: StateProvince;
}
