import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import { DepartmentService } from './department.service';
import * as logger from '../../config/logger';
import { UserService } from '../user/user.service';
import { EmployeeService } from '../employee/employee.service';
import { Employee } from '../employee/scheme/employee.entity';
import { ERole } from 'src/user/scheme/user.entity';

import * as jwt from 'jsonwebtoken';
import * as config from 'config';
import { Department } from './scheme/department.entity';
import { Repository } from 'typeorm';

@Controller('department')
export class DepartmentController {
  constructor(
    private departmentService: DepartmentService,
    // private departmentRepository: Repository<Department>,
    private employeeService: EmployeeService,
    private userService: UserService,
  ) {}

  @Put('/:id')
  @HttpCode(HttpStatus.OK)
  async modify(
    @Param('id') id: string,
    @Body() email,
    @Request() req,
  ): Promise<Employee> {
    try {
      return this.departmentService.modify(
        id,
        email,
        req.headers.authorization,
      );
    } catch (e) {
      logger.error(`FROM department/:id PUT ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id/change')
  @HttpCode(HttpStatus.OK)
  async changeBoss(@Param('id') id: string, @Body() email, @Request() req) {
    const decodedToken = jwt.verify(
      req.headers.authorization,
      config.get('jwtSecret'),
    );

    if (!decodedToken?.userId) {
      throw new ForbiddenException();
    }

    const dep = await this.departmentService.departmentRepository.findOne({
      id,
      bossId: decodedToken.userId,
    });

    if (!dep) {
      const usr = await this.userService.find(decodedToken.userId);

      if (usr?.role !== ERole.ADMIN) {
        throw new BadRequestException(
          'you should be department boss or admin for change the boss',
        );
      }
    }

    try {
      const usr = await this.userService.checkByEmail(email.email);
      if (!usr) {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
      const worker = await this.employeeService.find(usr.id, id);
      if (!worker) {
        throw new HttpException(
          "User didn't work on this department",
          HttpStatus.BAD_REQUEST,
        );
      }
      const isChange = await this.departmentService.changeBoss(id, usr.id);
      if (isChange.status === 200) {
        return isChange;
      } else {
        logger.error(`FROM departament/:id/change PUT ${id} -- STATUS 500`);
        throw new HttpException(
          'Internal Server Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }
    } catch (e) {
      if (e.status === 400 || e.status === 404) {
        throw e;
      }
      logger.error(`FROM departament/:id/change PUT ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  async find(@Param('id') id: string) {
    try {
      const dep = await this.departmentService.find(id);
      const workers = await this.employeeService.findAll(id);
      const promices = [];

      for (const val of workers) {
        promices.push(this.userService.find(val.userId));
      }

      const users = await Promise.all(promices);
      return {
        ...dep,
        users: users,
      };
    } catch (e) {
      logger.error(`FROM departament/:id GET ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async Get() {
    const deps = await this.departmentService.findAll();
    const promises = [];
    for (const val of deps) {
      promises.push(this.find(val.id));
    }
    return Promise.all(promises);
  }

  @Post('/create')
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() data, @Request() req) {
    try {
      const usr = await this.userService.findByEmail(data.bossEmail);
      if (!usr) {
        throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
      }

      const decodedToken = jwt.verify(
        req.headers.authorization,
        config.get('jwtSecret'),
      );

      if (!decodedToken?.userId) {
        throw new ForbiddenException();
      }

      const usrr = await this.userService.find(decodedToken.userId);

      if (usrr?.role !== ERole.ADMIN) {
        throw new BadRequestException('Only admin can create department');
      }

      const employee = await this.employeeService.findByUserId(usr.id);

      if (employee.length === 0) {
        const dep = await this.departmentService.create({
          name: data.name,
          type: data.type,
          bossId: usr.id,
        });
        if (!dep) {
          logger.error(
            `FROM departament/create POST dep -- STATUS ${HttpStatus.BAD_REQUEST}`,
          );
          throw new HttpException(
            'User is work in another department',
            HttpStatus.BAD_REQUEST,
          );
        } else {
          const isChange = await this.departmentService.lastUpdate(dep.id);
          if (isChange.affected !== 1) {
            throw new HttpException(
              'Department not found',
              HttpStatus.NOT_FOUND,
            );
          }
          return this.employeeService.create({
            userId: dep.bossId,
            departmentId: dep.id,
          });
        }
      } else {
        throw new HttpException(
          'User is work in another department',
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (e) {
      if (e.status === 400) {
        throw e;
      }

      logger.error(
        `FROM departament/create POST ${data.bossEmail} -- ${e} STATUS 500`,
      );
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  async remove(@Param('id') id: string, @Body() userId, @Request() req) {
    // try {
      const dep = await this.departmentService.find(id);

      if (dep.bossId !== userId.userId) {
        throw new HttpException(
          'You must be boss on this department',
          HttpStatus.BAD_REQUEST,
        );
      }
      await this.employeeService.removeAll(dep.id);

      return this.departmentService.remove(dep.id);
    // } catch (e) {
    //   logger.error(`FROM departament/:id DELETE ${id} -- ${e} STATUS 500`);
    //   throw new HttpException(
    //     'Internal Server Error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }

  @Delete('/:dep/workers/:id')
  @HttpCode(HttpStatus.OK)
  async removeEmployee(@Param('id') id: string, @Param('dep') depId: string, @Request() req) {
    // try {
      if (!req.headers.authorization) throw new ForbiddenException()
      const decodedToken = jwt.verify(
        req.headers.authorization,
        config.get('jwtSecret'),
      );

      if (!decodedToken?.userId) {
        throw new ForbiddenException();
      }

      const usrr = await this.userService.find(decodedToken.userId);

      if (usrr?.role !== ERole.ADMIN) {
        const dep = await this.departmentService.departmentRepository.findOne(depId)

        // console.log(dep.bossId, usrr.id);

        if (dep.bossId !== usrr.id) {
          throw new BadRequestException('Only boss/admin can dismiss employee');
        }
      }

      const isChange = await this.departmentService.lastUpdate(depId);

      if (isChange.affected !== 1) {
        throw new HttpException('Department not found', HttpStatus.NOT_FOUND);
      }

      return this.employeeService.remove(id, depId);
    // } catch (e) {
    //   logger.error(`FROM department/:id DELETE ${id} -- ${e} STATUS 500`);
    //   throw new HttpException(
    //     'Internal Server Error',
    //     HttpStatus.INTERNAL_SERVER_ERROR,
    //   );
    // }
  }
}
