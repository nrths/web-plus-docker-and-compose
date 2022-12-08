import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  public raised?: number;

  @IsOptional()
  public copied?: number;
}
