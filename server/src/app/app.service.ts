import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import * as config from 'config';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';

import { LoginDto } from './authDto/login.dto';
import { RegistrDto } from './authDto/registr.dto';
import { UserService } from '../user/user.service';

@Injectable()
export class AppService {
  constructor(private readonly userService: UserService) {}

  async registr(data: RegistrDto) {
    console.log('ok')
    const usr = await this.userService.create(data);
    const jwtToken = jwt.sign(
      {
        userId: usr.id,
        // role: usr.role
      },
      config.get('jwtSecret'),
      {
        // expiresIn: '1h',
      },
    );
    return { token: jwtToken, userId: usr.id, role: usr.role };
  }

  async login(data: LoginDto) {
    const usr = await this.userService.findByEmail(data.email);
    console.log(usr)
    const isMatch = await bcrypt.compare(data.password, usr.password);
    if (isMatch) {
      const jwtToken = jwt.sign(
        {
          userId: usr.id,
          
        },
        config.get('jwtSecret'),
        {
          // expiresIn: '1h',
        },
      );
      return { token: jwtToken, userId: usr.id, role: usr.role };
    } else {
      throw new HttpException('Wrong Password', HttpStatus.BAD_REQUEST);
    }
  }
}
