import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('countries')
export class Country {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  abbreviation: string;

  @Column({ length: 255 })
  name: string;
}
