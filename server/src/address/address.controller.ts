import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';

import { AddressService } from './address.service';
import { Address } from './scheme/address.entity';
import * as logger from '../../config/logger';

@Controller('user/:usr/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(@Param('usr') id: string): Promise<Address[]> {
    try {
      return this.addressService.findAll();
    } catch (e) {
      logger.error(`FROM address/ GET ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  find(@Param('id') id: string, @Param('usr') usrId: string): Promise<Address> {
    try {
      return this.addressService.find(id, usrId);
    } catch (e) {
      logger.error(`FROM address/:id GET ${usrId} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Delete('/:id')
  @HttpCode(HttpStatus.OK)
  remove(@Param('id') id: string, @Param('usr') usrId: string) {
    try {
      return this.addressService.remove(usrId, id);
    } catch (e) {
      logger.error(`FROM address/:id DELETE ${id} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
