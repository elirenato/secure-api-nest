import { Module } from '@nestjs/common';
import { CustomerController } from './customer.controller';
import { CountryController } from './country.controller';
import { StateProvinceController } from './state-province.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Country } from 'src/entities/country.entity';
import { StateProvince } from 'src/entities/state-province.entity';
import { Customer } from 'src/entities/customer.entity';
import { CountryService } from 'src/services/country.service';
import { StateProvinceService } from 'src/services/state-province.service';
import { CustomerService } from 'src/services/customer.service';

@Module({
  imports: [TypeOrmModule.forFeature([Country, StateProvince, Customer])],
  providers: [CountryService, StateProvinceService, CustomerService],
  controllers: [CountryController, StateProvinceController, CustomerController],
})
export class ControllersModule {}
