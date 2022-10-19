import { Controller, Get, Param } from '@nestjs/common';
import { GetByIdParam } from '../commons/get-by-id.param';
import { Country } from '../entities/country.entity';
import { CountryService } from '../services/country.service';

@Controller('api/countries')
export class CountryController {
  constructor(private readonly countryService: CountryService) {}

  @Get(':id')
  getCountryById(@Param() params: GetByIdParam): Promise<Country> {
    return this.countryService.getCountryById(Number(params.id));
  }

  @Get()
  listAllCountries(): Promise<Country[]> {
    return this.countryService.listAllCountries();
  }
}
