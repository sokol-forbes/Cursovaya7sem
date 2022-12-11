import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import e from 'express';
import { DepartmentService } from 'src/department/department.service';
import { EmployeeService } from 'src/employee/employee.service';
import { UserService } from 'src/user/user.service';
// import { Employee } from './scheme/employee.entity';
// import { EmployeeService } from './employee.service';
// import { EmployeeDto } from './employeeDto/employee.dto';

import * as logger from '../../config/logger';
import { EPriority, EStatus } from './schema/task.entity';
import { TaskService } from './task.service';

@Controller('task')
export class TaskController {
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private employeeService: EmployeeService
    ) {}

  @Post('create')
  async create(
    @Body()
    body: {
      title: string;
      priority: EPriority;
      assignedTo: string;
      description: string;
      departmentId: string;
      started_at: string;
      ended_at: string;
    },
  ) {
    const { assignedTo, ...props } = body;
    const user = await this.userService.findByEmail(assignedTo)

    if (!user) {
      throw new BadRequestException('User not found')
    }

    const employee = await this.employeeService.find(user.id, body.departmentId)

    if (!employee) {
      throw new BadRequestException('User not working on this department')
    }

    console.log(body)

    return await this.taskService.create({ ...props, status: EStatus.TODO, assignedToId: user.id })
  }

  @Get()
  async get(@Query('dep') dep, @Query('usr_id') usr_id) {
    return await this.taskService.getTasksByDepId(dep, usr_id);
  }

  @Get('/:id')
  async getById(@Param('id') id) {
    return await this.taskService.getTasksById(id);
  }

  @Put('/:id')
  async changeStatus(@Param('id') id, @Body() body: { status: EStatus }) {
    return await this.taskService.changeStatus(id, body.status);
  }

  // @Get()
  // @HttpCode(HttpStatus.OK)
  // findAll(@Param('dep') id: string): Promise<Employee[]> {
  //   try {
  //     return this.employeeService.findAll(id);
  //   } catch (e) {
  //     logger.error(`FROM department/ GET ALL -- ${e} STATUS 500`);
  //     throw new HttpException(
  //       'Internal Server Error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }

  // @Post('create')
  // @HttpCode(HttpStatus.CREATED)
  // create(@Body() data: EmployeeDto): Promise<Employee> {
  //   try {
  //     return this.employeeService.create(data);
  //   } catch (e) {
  //     logger.error(`FROM department/create POST -- ${e} STATUS 500`);
  //     throw new HttpException(
  //       'Internal Server Error',
  //       HttpStatus.INTERNAL_SERVER_ERROR,
  //     );
  //   }
  // }
}
