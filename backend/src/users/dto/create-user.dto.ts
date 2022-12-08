import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsUrl,
  Length,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @Length(2, 30)
  public username: string;

  @IsOptional()
  @Length(2, 200)
  public about: string;

  @IsUrl()
  public avatar: string;

  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsNotEmpty()
  @MinLength(6)
  public password: string;
}
