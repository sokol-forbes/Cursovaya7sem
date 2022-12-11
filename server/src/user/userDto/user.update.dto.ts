import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class UserChangeDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  password: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  skils: string;

  @IsNotEmpty()
  street: string;

  @IsNumber()
  home: number;

  @IsNumber()
  flat: number;
}
