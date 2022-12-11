import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcryptjs';

import { User } from './scheme/user.entity';
import * as logger from '../../config/logger';
import { UserChangeDto } from './userDto/user.update.dto';
import { AddressService } from '../address/address.service';
import { RegistrDto } from '../app/authDto/registr.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private adressService: AddressService,
  ) {}

  async findAll(): Promise<User[]> {
    const usr = await this.userRepository.find();
    if (!usr) {
      logger.error(`FROM / GET ${usr} --  STATUS 404`);
      throw new HttpException(
        'Users not found',
        HttpStatus.NOT_FOUND,
      );
    }
    return usr;
  }

  async find(id: string) {
    const usr = await this.userRepository.findOne({
      where: { id: id },
      relations: ['addressId'],
    });

    if (!usr) {
      logger.error(`FROM /:id GET ${id} -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    return {
      id: usr.id,
      email: usr.email,
      name: usr.name,
      role: usr.role,
      surname: usr.surname,
      skils: usr.skils,
      addressId: usr.addressId.id,
      street: usr.addressId.street,
      home: usr.addressId.home,
      date: usr.date,
      flat: usr.addressId.flat,
    };
  }

  async findByEmail(email: string): Promise<User> {
    const usr = await this.userRepository.findOne({ email: email });
    if (!usr) {
      logger.error(
        `FROM /email GET ${email} -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
    return usr;
  }

  checkByEmail(email: string): Promise<User> {
    console.log('hereu')
    return this.userRepository.findOne({ email: email });
  }

  async create(user: RegistrDto): Promise<User> {
    const usr = await this.checkByEmail(user.email);
    if (!!usr) {
      throw new HttpException('User is exist', HttpStatus.BAD_REQUEST);
    }
    const addr = await this.adressService.create({
      street: user.street,
      home: user.home,
      flat: user.flat,
    });

    if (!addr) {
      throw new HttpException("User isn't create", HttpStatus.NOT_FOUND);
    }

    const hashedPassword = await bcrypt.hash(user.password, 12);
    return this.userRepository.save({
      email: user.email,
      password: hashedPassword,
      name: user.name,
      surname: user.surname,
      skils: user.skils,
      addressId: addr,
    });
  }

  async remove(id: string) {
    const isDeleted = await this.userRepository.delete(id);
    if (!isDeleted) {
      logger.error(`FROM /:id DELETE ${id} -- STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else if (isDeleted.affected === 0) {
      logger.error(`FROM /:id DELETE ${id} -- STATUS ${HttpStatus.NOT_FOUND}`);
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 1) {
      return {
        message: 'User deleted',
        status: HttpStatus.OK,
      };
    }
  }

  async change(id: string, data: UserChangeDto) {
    const usr = await this.userRepository.findOne(id);
    const isMatch = await bcrypt.compare(data.password, usr.password);
    if (!isMatch) {
      throw new HttpException('Password is mismatch', HttpStatus.BAD_REQUEST);
    }
    if (usr.email !== data.email) {
      const usr = await this.checkByEmail(data.email);
      if (usr) {
        throw new HttpException('Email busy', HttpStatus.BAD_REQUEST);
      }
      return usr;
    }

    const isUpdated = await this.userRepository.update(id, {
      name: data.name,
      surname: data.surname,
      email: data.email,
      skils: data.skils,
      addressId: {
        street: data.street,
        home: data.home,
        flat: data.flat,
      },
    });

    if (isUpdated.affected === 1) {
      return id;
    } else {
      throw new HttpException(
        'Interanl Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
