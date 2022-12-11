import { IsEmail, IsNotEmpty } from 'class-validator';

export class UserData {
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
}
