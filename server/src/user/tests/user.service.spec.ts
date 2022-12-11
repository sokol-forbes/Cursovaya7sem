import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AddressService } from '../../address/address.service';
import { Address } from '../../address/scheme/address.entity';
import { Repository } from 'typeorm';
import { User } from '../scheme/user.entity';
import { UserController } from '../user.controller';
import { UserService } from '../user.service';
import { RegistrDto } from '../../app/authDto/registr.dto';
import { HttpException } from '@nestjs/common';

describe('UserService', () => {
  let service: UserService;
  let userMockRepository: Repository<User>;
  let addrMockRepository: Repository<Address>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        AddressService,
        {
          provide: getRepositoryToken(Address),
          useClass: Repository,
        },
      ],
    }).compile();

    service = await module.get<UserService>(UserService);
    userMockRepository = await module.get<Repository<User>>(
      getRepositoryToken(User),
    );
    addrMockRepository = await module.get<Repository<Address>>(
      getRepositoryToken(Address),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const testAddress: Address = {
    id: '1',
    street: 'street',
    home: 1,
    flat: 1,
  };

  const testUser: User = {
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'kiril@gmail.by',
    skils: 'skils',
    date: new Date(Date.now()),
    password: 'asfsdgl;sdcs',
    addressId: testAddress,
  };

  const registrUserData: RegistrDto = {
    name: 'kirill',
    surname: 'bogomaz',
    email: 'kirill@gmail.by',
    skils: 'some skils',
    street: 'street',
    password: 'dsgsdg',
    confirnPassword: 'dsgsdg',
    home: 1,
    flat: 1,
  };

  const registrUserDataFailed: RegistrDto = {
    name: 'kirill',
    surname: 'bogomaz',
    email: 'kiril@gmail.by',
    skils: 'some skils',
    street: 'street',
    password: 'dsgsdg',
    confirnPassword: 'dsgsdg',
    home: 1,
    flat: 1,
  };

  const returnUser = {
    id: '1',
    name: 'name',
    surname: 'surname',
    email: 'kiril@gmail.by',
    skils: 'skils',
    addressId: '1',
    street: 'street',
    home: 1,
    flat: 1,
  };

  const testUser2: User = {
    id: '2',
    name: 'name',
    surname: 'surname',
    email: 'kiril@mail.ry',
    skils: 'skils',
    date: new Date(Date.now()),
    password: 'asfsdgl;sdcs',
    addressId: { ...testAddress, id: '2' },
  };

  describe('find', () => {
    test('should return user by id', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise((resolve) => {
          for (const user of [testUser, testUser2]) {
            if (testUser.id === user.id) {
              resolve(user);
            }
          }
          resolve(undefined);
        }),
      );
      expect(await service.find(testUser.id)).toEqual(returnUser);
    });

    test('should return HttpExteption', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise((resolve) => {
          for (const user of [testUser, testUser2]) {
            if ('4' === user.id) {
              resolve(user);
            }
          }
          resolve(undefined);
        }),
      );
      try {
        await service.find('4');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('findByEmail', () => {
    test('should return user by email', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => {
          for (const user of [testUser, testUser2]) {
            if (testUser.email === user.email) {
              resolve(user);
            }
          }
          return undefined;
        }),
      );
      expect(await service.findByEmail(testUser.email)).toEqual(testUser);
    });
    test('should return httpException', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => {
          for (const user of [testUser, testUser2]) {
            if ('andrei@gmail.com' === user.email) {
              resolve(user);
            }
          }
          resolve(undefined);
        }),
      );
      try {
        await service.findByEmail('andrei@gmail.com');
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('findAll', () => {
    test('should return array of users', async () => {
      jest
        .spyOn(userMockRepository, 'find')
        .mockResolvedValueOnce([testUser, testUser2]);

      expect(await service.findAll()).toEqual([testUser, testUser2]);
    });
  });

  describe('create', () => {
    test('should return array of users', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => {
          for (const user of [testUser, testUser2]) {
            if (registrUserData.email === user.email) {
              resolve(user);
            }
          }
          resolve(undefined);
        }),
      );

      jest.spyOn(userMockRepository, 'save').mockResolvedValueOnce(
        new Promise<User>((resolve) => resolve(testUser)),
      );

      jest.spyOn(addrMockRepository, 'save').mockResolvedValueOnce(testAddress);

      expect(await service.create(registrUserData)).toEqual(testUser);
    });

    test('shoult return HttpExteption', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => {
          for (const user of [testUser, testUser2]) {
            if (registrUserDataFailed.email === user.email) {
              resolve(user);
            }
          }
          resolve(undefined);
        }),
      );

      try {
        await service.create(registrUserDataFailed);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });
});
