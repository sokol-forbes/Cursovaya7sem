import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { User } from '../user/scheme/user.entity';
import { AddressDto } from './addressDto/address.dto';
import { Address } from './scheme/address.entity';
import * as logger from '../../config/logger';
import { UserChangeDto } from '../user/userDto/user.update.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private addressRepository: Repository<Address>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async findAll(): Promise<Address[]> {
    const addr = await this.addressRepository.find();
    if (!addr) {
      logger.error(`FROM address/ GET ${addr} -- NOT FOUND STATUS 404`);
      throw new HttpException('Adress not found', HttpStatus.NOT_FOUND);
    } else {
      return addr;
    }
  }

  async find(id: string, userId: string): Promise<Address> {
    const usr = await this.userRepository.findOne(userId);
    if (usr.addressId.id !== id) {
      logger.error(
        `FROM address/:id GET ${userId} -- unathorization access STATUS ${HttpStatus.UNAUTHORIZED}`,
      );
      throw new HttpException('unathorization access', HttpStatus.UNAUTHORIZED);
    }
    return this.addressRepository.findOne(id);
  }

  async create(address: AddressDto): Promise<Address> {
    const addr = await this.addressRepository.save(address);
    if (!addr) {
      logger.error(`FROM address/create POST ${address} -- STATUS 500`);
      throw new HttpException(
        'Internal Server Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return addr;
    }
  }

  async remove(userId: string, id: string) {
    const isDeleted = await this.addressRepository.delete(id);
    if (isDeleted.affected === 0) {
      logger.error(
        `FROM address/:id DELETE ${userId} -- STATUS ${HttpStatus.NOT_FOUND}`,
      );
      throw new HttpException('User address not found', HttpStatus.NOT_FOUND);
    } else if (isDeleted.affected === 1) {
      return {
        message: 'Address deleted',
        status: HttpStatus.OK,
      };
    }
  }

  async change(id: string, data: UserChangeDto) {
    const isChange = await this.addressRepository.update(
      { id: id },
      {
        street: data.street,
        home: data.home,
        flat: data.flat,
      },
    );
    if (isChange.affected === 1) {
      return {
        message: 'Data change',
        status: HttpStatus.OK,
      };
    } else {
      logger.error(`FROM address/:id PUT ${id} -- STATUS 404`);
      throw new HttpException("User isn't change", HttpStatus.NOT_FOUND);
    }
  }
}
