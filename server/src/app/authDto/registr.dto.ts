import { IsEmail, IsNotEmpty, Length } from 'class-validator';

export class RegistrDto {
  @IsEmail()
  readonly email: string;

  @IsNotEmpty()
  readonly name: string;

  @IsNotEmpty()
  readonly surname: string;

  @IsNotEmpty()
  readonly skils: string;

  @IsNotEmpty()
  readonly street: string;

  @IsNotEmpty()
  readonly home: number;

  @IsNotEmpty()
  readonly flat: number;

  @Length(6)
  readonly password: string;

  @IsNotEmpty()
  readonly confirnPassword: string;
}
