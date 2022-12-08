import { IsArray, IsOptional, IsUrl, Length } from 'class-validator';

export class CreateWishlistDto {
  @Length(1, 250)
  name: string;

  @IsUrl()
  image: string;

  @IsOptional()
  @Length(1, 1500)
  description: string;

  @IsArray()
  itemsId: [id: number];
}
