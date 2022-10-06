import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StateProvinceController } from './state-province.controller';
import { StateProvince } from './state-province.entity';
import { StateProvinceService } from './state-province.service';

@Module({
  imports: [TypeOrmModule.forFeature([StateProvince])],
  providers: [StateProvinceService],
  controllers: [StateProvinceController],
})
export class StateProvinceModule {}
