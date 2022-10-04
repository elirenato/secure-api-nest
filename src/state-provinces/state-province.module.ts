import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateProvince } from './state-province.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StateProvince])],
  providers: [],
  controllers: [],
})
export class StateProvinceModule {}
