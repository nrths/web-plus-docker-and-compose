import { IsBoolean, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateOfferDto {
  @IsNotEmpty()
  public amount: number;

  @IsOptional()
  @IsBoolean()
  public hidden: boolean;

  @IsNotEmpty()
  public itemId: number;
}
