import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';

import { AppService } from './app.service';
import { LoginDto } from './authDto/login.dto';
import { RegistrDto } from './authDto/registr.dto';

import * as logger from '../../config/logger';
// import { UserAddQueue } from 'src/microservices/usersQueue/user.queue.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/login')
  @HttpCode(HttpStatus.OK)
  login(@Body() data: LoginDto) {
    try {
      return this.appService.login(data);
    } catch (e) {
      logger.error(`FROM /login POST ${data.email} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  // @Get('/activate/userqueue')
  // userQueue() {
  //   this.service.userQueueAdd()
  // }

  @Post('/registr')
  @HttpCode(HttpStatus.OK)
  registr(@Body() data: RegistrDto) {
    console.log('fghjkl')
    try {
      return this.appService.registr(data);
    } catch (e) {
      logger.error(`FROM /registr POST ${data.email} -- ${e} STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
