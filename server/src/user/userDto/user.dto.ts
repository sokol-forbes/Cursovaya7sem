import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class UserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  @Length(6)
  password: string;

  @IsNotEmpty()
  surname: string;

  @IsNotEmpty()
  skils: string;

  @IsNotEmpty()
  addressId: string;
}
