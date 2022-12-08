import { IsNotEmpty, IsUrl, Length, Min } from 'class-validator';

export class CreateWishDto {
  @IsNotEmpty()
  @Length(1, 250)
  public name: string;

  @IsNotEmpty()
  @IsUrl()
  public link: string;

  @IsNotEmpty()
  @IsUrl()
  public image: string;

  @IsNotEmpty()
  @Min(1)
  public price: number;

  @IsNotEmpty()
  @Length(1, 1024)
  description: string;
}
