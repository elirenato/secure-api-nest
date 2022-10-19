import { Controller, Get, Param, Query } from '@nestjs/common';
import { IsNumberString } from 'class-validator';
import { GetByIdParam } from '../commons/get-by-id.param';
import { StateProvince } from '../entities/state-province.entity';
import { StateProvinceService } from '../services/state-province.service';

class StateProvincesQuery {
  @IsNumberString()
  country: number;
}

@Controller('api/state-provinces')
export class StateProvinceController {
  constructor(private readonly stateProvinceService: StateProvinceService) {}

  @Get(':id')
  getStateProvinceById(@Param() params: GetByIdParam): Promise<StateProvince> {
    return this.stateProvinceService.getStateProvinceById(Number(params.id));
  }

  @Get()
  listAllStateProvinces(
    @Query() query: StateProvincesQuery,
  ): Promise<StateProvince[]> {
    return this.stateProvinceService.listAllStateProvinces(
      Number(query.country),
    );
  }
}
