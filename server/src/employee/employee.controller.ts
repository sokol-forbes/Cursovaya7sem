import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';
import { Employee } from './scheme/employee.entity';
import { EmployeeService } from './employee.service';
import { EmployeeDto } from './employeeDto/employee.dto';

import * as logger from '../../config/logger';

@Controller('/department/:dep/workers')
export class EmployeeController {
  constructor(
    private employeeService: EmployeeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Param('dep') id: string): Promise<Employee[]> {
    try {
      return this.employeeService.findAll(id);
    } catch (e) {
      logger.error(`FROM department/ GET ALL -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Post('create')
  @HttpCode(HttpStatus.CREATED)
  create(@Body() data: EmployeeDto): Promise<Employee> {
    try {
      return this.employeeService.create(data);
    } catch (e) {
      logger.error(`FROM department/create POST -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
