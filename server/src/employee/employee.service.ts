import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Employee } from './scheme/employee.entity';
import { EmployeeDto } from './employeeDto/employee.dto';

import * as logger from '../../config/logger';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private employeeRepository: Repository<Employee>,
  ) {}

  async findAll(id: string): Promise<Employee[]> {
    const employee = await this.employeeRepository.find({ departmentId: id });

    if (!employee) {
      logger.error(
        `FROM department/:id/employee/ GET ALL -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('Internal Server Error', HttpStatus.NOT_FOUND);
    }
    return employee;
  }

  findByUserId(id: string) {
    return this.employeeRepository.find({ userId: id });
  }

  find(userId: string, depId: string) {
    return this.employeeRepository.findOne({
      userId: userId,
      departmentId: depId,
    });
  }

  async create(data: EmployeeDto): Promise<Employee> {
    const employees = await this.employeeRepository.find({
      userId: data.userId,
    });
    if (!employees[0]) {
      const worker = await this.employeeRepository.save(data);
      if (!worker) {
        logger.error(
          `FROM department/:id/employee/ CREATE ${data.userId} -- STATUS 500`,
        );
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      } else {
        return worker;
      }
    } else {
      throw new HttpException(
        `User is worked in another repository`,
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async remove(userId: string, departmentId: string) {
    const isDeleted = await this.employeeRepository.delete({
      userId: userId,
      departmentId: departmentId,
    });
    if (!isDeleted) {
      logger.error(`FROM employee DELETE -- STATUS 404`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 0) {
      logger.error(`FROM employee DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 1) {
      return {
        message: 'Employee deleted',
        status: HttpStatus.OK,
      };
    }
  }

  async removeAll(departmentId: string) {
    const isDeleted = await this.employeeRepository.delete({
      departmentId: departmentId,
    });
    if (!isDeleted) {
      logger.error(`FROM employee DELETE -- STATUS 404`);
      throw new HttpException("Department isn't delete", HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 0) {
      logger.error(`FROM employee DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 1) {
      return {
        message: 'Departament is deleted',
        status: HttpStatus.OK,
      };
    }
  }
}
