import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StateProvince } from '../entities/state-province.entity';

@Injectable()
export class StateProvinceService {
  constructor(
    @InjectRepository(StateProvince)
    private stateRepository: Repository<StateProvince>,
  ) {}

  listAllStateProvinces(countryId: number): Promise<StateProvince[]> {
    return this.stateRepository.find({
      where: {
        country: {
          id: countryId,
        },
      },
      order: {
        name: 'asc',
      },
    });
  }

  getStateProvinceById(id: number): Promise<StateProvince> {
    return this.stateRepository.findOneByOrFail({ id });
  }
}
