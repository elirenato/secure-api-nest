import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Country } from '../entities/country.entity';

@Injectable()
export class CountryService {
  constructor(
    @InjectRepository(Country)
    private countryRepository: Repository<Country>,
  ) {}

  listAllCountries(): Promise<Country[]> {
    return this.countryRepository.find({
      order: {
        name: 'asc',
      },
    });
  }

  getCountryById(id: number): Promise<Country> {
    return this.countryRepository.findOneByOrFail({ id });
  }
}
