import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserService } from 'src/user/user.service';
import { Repository } from 'typeorm';
// import { Employee } from './scheme/employee.entity';
// import { EmployeeDto } from './employeeDto/employee.dto';

import * as logger from '../../config/logger';
import { EPriority, EStatus, Task } from './schema/task.entity';

@Injectable()
export class TaskService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
    private userService: UserService,
  ) {}

  async create(props: {
    title: string;
    priority: EPriority;
    assignedToId: string;
    status: EStatus;
    description: string;
    departmentId: string;
    started_at: string;
    ended_at: string;
  }) {
    return await this.taskRepository.save(props);
  }

  async getTasksByDepId(departmentId: string, usr_id?: string) {
    const tasks = usr_id
      ? await await this.taskRepository.find({
          departmentId,
          assignedToId: usr_id,
        })
      : await this.taskRepository.find({ departmentId });

    return await Promise.all(
      tasks.map(async (task) => {
        return {
          ...task,
          user: {
            email: (await this.userService.find(task.assignedToId))?.email,
          },
        };
      }),
    );
  }

  async getTasksById(id) {
    const task = await this.taskRepository.findOne(id);

    if (!task) {
      throw new BadRequestException('');
    }

    const user = await this.userService.find(task.assignedToId);

    return {
      ...task,
      user: {
        email: user.email,
      },
    };
  }

  async changeStatus(id: string, status: EStatus) {
    return await this.taskRepository.update({ id }, {
      status
    })
  }

  // async findAll(id: string): Promise<Employee[]> {
  //   const employee = await this.employeeRepository.find({ departmentId: id });

  //   if (!employee) {
  //     logger.error(
  //       `FROM department/:id/employee/ GET ALL -- STATUS ${HttpStatus.NOT_FOUND}`,
  //     );
  //     throw new HttpException('Internal Server Error', HttpStatus.NOT_FOUND);
  //   }
  //   return employee;
  // }

  // findByUserId(id: string) {
  //   return this.employeeRepository.find({ userId: id });
  // }

  // find(userId: string, depId: string) {
  //   return this.employeeRepository.findOne({
  //     userId: userId,
  //     departmentId: depId,
  //   });
  // }

  // async create(data: EmployeeDto): Promise<Employee> {
  //   const employees = await this.employeeRepository.find({
  //     userId: data.userId,
  //   });
  //   if (!employees[0]) {
  //     const worker = await this.employeeRepository.save(data);
  //     if (!worker) {
  //       logger.error(
  //         `FROM department/:id/employee/ CREATE ${data.userId} -- STATUS 500`,
  //       );
  //       throw new HttpException(
  //         'Internal Server Error',
  //         HttpStatus.INTERNAL_SERVER_ERROR,
  //       );
  //     } else {
  //       return worker;
  //     }
  //   } else {
  //     throw new HttpException(
  //       `User is worked in another repository`,
  //       HttpStatus.BAD_REQUEST,
  //     );
  //   }
  // }

  // async remove(userId: string, departmentId: string) {
  //   const isDeleted = await this.employeeRepository.delete({
  //     userId: userId,
  //     departmentId: departmentId,
  //   });
  //   if (!isDeleted) {
  //     logger.error(`FROM employee DELETE -- STATUS 404`);
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   } else if (isDeleted.affected === 0) {
  //     logger.error(`FROM employee DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`);
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   } else if (isDeleted.affected === 1) {
  //     return {
  //       message: 'Employee deleted',
  //       status: HttpStatus.OK,
  //     };
  //   }
  // }

  // async removeAll(departmentId: string) {
  //   const isDeleted = await this.employeeRepository.delete({
  //     departmentId: departmentId,
  //   });
  //   if (!isDeleted) {
  //     logger.error(`FROM employee DELETE -- STATUS 404`);
  //     throw new HttpException("Department isn't delete", HttpStatus.NOT_FOUND);
  //   } else if (isDeleted.affected === 0) {
  //     logger.error(`FROM employee DELETE  -- STATUS ${HttpStatus.NOT_FOUND}`);
  //     throw new HttpException('User not found', HttpStatus.NOT_FOUND);
  //   } else if (isDeleted.affected === 1) {
  //     return {
  //       message: 'Departament is deleted',
  //       status: HttpStatus.OK,
  //     };
  //   }
  // }
}
