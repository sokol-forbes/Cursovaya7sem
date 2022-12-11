import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
  Put,
} from '@nestjs/common';

import { User } from './scheme/user.entity';
import { UserService } from './user.service';
import * as logger from '../../config/logger';
import { UserChangeDto } from './userDto/user.update.dto';
import { AddressService } from '../address/address.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private addressService: AddressService,
  ) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<User[]> {
    try {
      return this.userService.findAll();
    } catch (e) {
      logger.error(`FROM / GET ALL -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string) {
    try {
      return this.userService.find(id);
    } catch (e) {
      logger.error(`FROM /:id GET ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id/data')
  @HttpCode(HttpStatus.OK)
  getData(@Param('id') id: string) {
    try {
      return this.userService.find(id);
    } catch (e) {
      logger.error(`FROM user/:id/data GET -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id/delete')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string) {
    try {
      return this.userService
        .find(id)
        .then((usr) => {
          return this.addressService.remove(id, usr.addressId);
        })
        .then(() => {
          return this.userService.remove(id);
        });
    } catch (e) {
      logger.error(`FROM user/:id/delete GET -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Put('/:id/modify')
  @HttpCode(HttpStatus.OK)
  modify(@Param('id') id: string, @Body() data: UserChangeDto) {
    try {
      return this.userService.change(id, data);
    } catch (e) {
      logger.error(`FROM user/:id/modify PUT -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
