import { SerializeOptions } from '@nestjs/common';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Country } from '../countries/country.entity';

@Entity('state_provinces')
export class StateProvince {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  abbreviation: string;

  @Column({ length: 255 })
  name: string;

  @ManyToOne(() => Country, null, { eager: true, nullable: false })
  @JoinColumn({ name: 'country_id' })
  country: Country;
}
