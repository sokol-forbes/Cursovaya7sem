import { Module } from '@nestjs/common';
import { getRepositoryToken, TypeOrmModule } from '@nestjs/typeorm';

import { UserController } from './user.controller';
import { User } from './scheme/user.entity';
import { UserService } from './user.service';
import { AddressModule } from '..//address/address.module';

@Module({
  imports: [TypeOrmModule.forFeature([User]), AddressModule],
  controllers: [UserController],
  providers: [
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
