import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './scheme/department.entity';
import { DepartmentDto } from './departmentDto/department.dto';
import * as logger from '../../config/logger';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import * as jwt from 'jsonwebtoken';
import * as config from 'config';

@Injectable()
export class DepartmentService {
  constructor(
    @InjectRepository(Department)
    public departmentRepository: Repository<Department>,
    private userService: UserService,
    private employeeService: EmployeeService,
  ) {}

  async findAll(): Promise<Department[]> {
    const department = await this.departmentRepository.find();
    if (!department) {
      logger.error(`FROM departament/ GET -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException('Departments not found', HttpStatus.NOT_FOUND);
    }
    return department;
  }

  async find(id: string): Promise<Department> {
    const department = await this.departmentRepository.findOne(id);
    if (!department) {
      logger.error(
        `FROM departament/:id GET -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }
    return department;
  }

  async create(data: DepartmentDto): Promise<Department> {
    const department = await this.departmentRepository.save(data);
    if (!department) {
      logger.error(`FROM departament/ POST -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException("Department is't create", HttpStatus.NOT_FOUND);
    }
    return department;
  }

  async lastUpdate(id: string) {
    return await this.departmentRepository.update(
      { id: id },
      {
        update: new Date(Date.now()),
      },
    );
  }

  async changeBoss(id: string, bossId: string) {
    const isChange = await this.departmentRepository.update(
      { id: id },
      {
        bossId: bossId,
        update: new Date(Date.now()),
      },
    );
    if (isChange.affected === 1) {
      return {
        message: 'Boss is change',
        status: HttpStatus.OK,
      };
    } else {
      logger.error(
        `FROM departament/:id PUT -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException("Boss isn't changed", HttpStatus.NOT_FOUND);
    }
  }

  async modify(id: string, email, token: string) {
    const decodedToken = jwt.verify(token, config.get('jwtSecret'));

    if (!decodedToken?.userId) {
      throw new ForbiddenException()
    }

    const dep = await this.departmentRepository.findOne({ id, bossId: decodedToken.userId })

    if (!dep) {
      throw new BadRequestException('you should be department boss for add an employees')
    }

    const usr = await this.userService.findByEmail(email.email);
    if (!usr) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    const worker = await this.employeeService.find(usr.id, id);
    if (worker) {
      throw new HttpException(
        'User is worker on this department yet',
        HttpStatus.BAD_REQUEST,
      );
    }
    const isChange = await this.lastUpdate(id);

    if (isChange.affected !== 1) {
      throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
    }

    return this.employeeService.create({
      userId: usr.id,
      departmentId: id,
    });
  }

  async remove(id: string) {
    const isDeleted = await this.departmentRepository.delete(id);
    if (isDeleted.affected === 0) {
      logger.error(
        `FROM departament/:id DELETE -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('Departament not found', HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 1) {
      return {
        message: 'Department deleted',
        status: HttpStatus.OK,
      };
    }
  }
}
