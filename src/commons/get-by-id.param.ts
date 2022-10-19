import { IsNumberString } from 'class-validator';

export class GetByIdParam {
  @IsNumberString()
  id: number;
}
