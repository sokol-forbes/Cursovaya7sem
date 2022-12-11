import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../user/scheme/user.entity';
import { UserService } from '../../user/user.service';
import { Repository, UpdateResult } from 'typeorm';
import { DepartmentService } from '../department.service';
import { Department } from '../scheme/department.entity';
import { DepartmentController } from '../department.controller';
import { AddressService } from '../../address/address.service';
import { Address } from '../../address/scheme/address.entity';
import { EmployeeService } from '../../employee/employee.service';
import { Employee } from '../../employee/scheme/employee.entity';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DepartmentDto } from '../departmentDto/department.dto';

describe('DepartmentController', () => {
  let departmentService: DepartmentService;
  let departmentController: DepartmentController;
  let departmentMockRepository: Repository<Department>;
  let userMockRepository: Repository<User>;
  let employeeMockRepository: Repository<Employee>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      controllers: [DepartmentController],
      providers: [
        DepartmentService,
        {
          provide: getRepositoryToken(Department),
          useClass: Repository,
        },
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
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useClass: Repository,
        },
      ],
    }).compile();

    departmentController = await module.get<DepartmentController>(
      DepartmentController,
    );
    departmentService = await module.get<DepartmentService>(DepartmentService);
    departmentMockRepository = await module.get<Repository<Department>>(
      getRepositoryToken(Department),
    );
    userMockRepository = await module.get<Repository<User>>(
      getRepositoryToken(User),
    );
    employeeMockRepository = await module.get<Repository<Employee>>(
      getRepositoryToken(Employee),
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

  const testDepartment: Department = {
    id: '1',
    name: 'name',
    type: 'type',
    date: new Date(Date.now()),
    count: 0,
    bossId: '1',
  };

  const testEmployee: Employee = {
    id: '1',
    userId: '1',
    departmentId: '1',
    date: Date.now().toString(),
  };

  const returnDepartment = {
    id: '1',
    name: 'name',
    type: 'type',
    date: new Date(Date.now()),
    count: 0,
    bossId: '1',
    users: [
      {
        id: '1',
        email: 'kiril@gmail.by',
        name: 'name',
        surname: 'surname',
        skils: 'skils',
        addressId: '1',
        street: 'street',
        home: 1,
        flat: 1,
      },
    ],
  };

  const newDepartment: DepartmentDto = {
    bossId: '1',
    name: 'name',
    type: 'type',
  };

  describe('create new Employee', () => {
    test('should return new employee', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => resolve(testUser)),
      );

      jest.spyOn(employeeMockRepository, 'find').mockResolvedValue(
        new Promise<Employee[]>((resolve) => resolve([])),
      );
      jest
        .spyOn(employeeMockRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      jest
        .spyOn(employeeMockRepository, 'save')
        .mockResolvedValueOnce(testEmployee);

      expect(await departmentController.modify('1', testUser.email)).toEqual(
        testEmployee,
      );
    });

    test('should return HttpExteption', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => resolve(undefined)),
      );

      try {
        await departmentController.modify('1', testUser.email);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('changeBoss', () => {
    test('should return message', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(
        new Promise<User>((resolve) => resolve(testUser)),
      );

      jest
        .spyOn(employeeMockRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      jest.spyOn(departmentMockRepository, 'update').mockResolvedValueOnce(
        new Promise<UpdateResult>((resolve) =>
          resolve({
            affected: 1,
            raw: 0,
            generatedMaps: undefined,
          }),
        ),
      );

      expect(
        await departmentService.changeBoss(testDepartment.id, testUser.email),
      ).toEqual({
        message: 'Boss is change',
        status: 200,
      });
    });

    test('should return HttpExteption', async () => {
      jest
        .spyOn(userMockRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      try {
        await departmentController.changeBoss(
          testDepartment.id,
          testUser.email,
        );
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('find', () => {
    test('should return departmnet by id', async () => {
      jest
        .spyOn(departmentMockRepository, 'findOne')
        .mockResolvedValueOnce(testDepartment);

      jest
        .spyOn(employeeMockRepository, 'find')
        .mockResolvedValueOnce([testEmployee]);

      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(testUser);

      expect(await departmentController.find(testDepartment.id)).toEqual(
        returnDepartment,
      );
    });
  });

  describe('Get', () => {
    test('should return array of departmnet', async () => {
      jest
        .spyOn(departmentMockRepository, 'find')
        .mockResolvedValueOnce([testDepartment]);
      jest
        .spyOn(departmentMockRepository, 'findOne')
        .mockResolvedValueOnce(testDepartment);

      jest
        .spyOn(employeeMockRepository, 'find')
        .mockResolvedValueOnce([testEmployee]);

      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(testUser);

      expect(await departmentController.Get()).toEqual([returnDepartment]);
    });
  });

  describe('create', () => {
    test('should return new employee', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(testUser);

      jest.spyOn(employeeMockRepository, 'find').mockResolvedValue(
        new Promise<Employee[]>((resolve) => resolve([])),
      );

      jest
        .spyOn(employeeMockRepository, 'save')
        .mockResolvedValueOnce(testEmployee);

      jest
        .spyOn(departmentMockRepository, 'save')
        .mockResolvedValueOnce(testDepartment);

      expect(await departmentController.create(newDepartment)).toEqual(
        testEmployee,
      );
    });

    test('should return HttpExteption', async () => {
      jest.spyOn(userMockRepository, 'findOne').mockResolvedValueOnce(testUser);

      jest.spyOn(employeeMockRepository, 'find').mockResolvedValue(
        new Promise<Employee[]>((resolve) => resolve([testEmployee])),
      );

      try {
        await departmentController.create(newDepartment);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('remove', () => {
    test('should return message', async () => {
      jest
        .spyOn(departmentMockRepository, 'findOne')
        .mockResolvedValueOnce(testDepartment);

      jest.spyOn(employeeMockRepository, 'delete').mockResolvedValue({
        affected: 1,
        raw: 0,
      });

      jest.spyOn(departmentMockRepository, 'delete').mockResolvedValueOnce({
        affected: 1,
        raw: 0,
      });

      expect(
        await departmentController.remove(testDepartment.id, {
          userId: testUser.id,
        }),
      ).toEqual({
        message: 'Department deleted',
        status: HttpStatus.OK,
      });
    });

    test('should return HttpExteption', async () => {
      jest
        .spyOn(departmentMockRepository, 'findOne')
        .mockRejectedValueOnce(testDepartment);

      try {
        await departmentController.remove(testDepartment.id, testUser.id);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });
});
