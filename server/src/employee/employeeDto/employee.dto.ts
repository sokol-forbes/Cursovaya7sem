import { IsNotEmpty } from 'class-validator';

export class EmployeeDto {
  @IsNotEmpty()
  userId: string;

  @IsNotEmpty()
  departmentId: string;
}
