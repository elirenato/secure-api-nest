import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';

@Entity('customers')
export class Customer {
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
}
