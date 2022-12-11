import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class AddressDto {
  @IsNotEmpty()
  @IsString()
  street: string;

  @IsNumber()
  home: number;

  @IsNumber()
  flat: number;
}
