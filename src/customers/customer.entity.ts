import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { SerializeOptions } from '@nestjs/common';

@Entity()
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
  @Column({ unique: true, length: 255 })
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
