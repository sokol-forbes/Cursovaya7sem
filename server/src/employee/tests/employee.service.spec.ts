import { HttpException, HttpStatus } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DeleteResult, Repository } from 'typeorm';
import { EmployeeService } from '../employee.service';
import { EmployeeDto } from '../employeeDto/employee.dto';
import { Employee } from '../scheme/employee.entity';

describe('EmployeeService', () => {
  let service: EmployeeService;
  let employeeMockRepository: Repository<Employee>;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        EmployeeService,
        {
          provide: getRepositoryToken(Employee),
          useClass: Repository,
        },
      ],
    }).compile();

    service = await module.get<EmployeeService>(EmployeeService);
    employeeMockRepository = await module.get<Repository<Employee>>(
      getRepositoryToken(Employee),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  const testEmployee1: Employee = {
    id: '1',
    userId: '1',
    departmentId: '1',
    date: Date.now().toString(),
  };

  const testEmployee2: Employee = {
    id: '2',
    userId: '2',
    departmentId: '1',
    date: Date.now().toString(),
  };

  const newEmployeeDto: EmployeeDto = {
    userId: '3',
    departmentId: '1',
  };

  const testEmployee3: Employee = {
    id: '3',
    userId: '3',
    departmentId: '1',
    date: Date.now().toString(),
  };

  describe('findAll', () => {
    test('should return array of employee', async () => {
      jest
        .spyOn(employeeMockRepository, 'find')
        .mockResolvedValueOnce([testEmployee1, testEmployee2]);

      expect(await service.findAll(testEmployee1.departmentId)).toEqual([
        testEmployee1,
        testEmployee2,
      ]);
    });
  });

  describe('create', () => {
    test('should return new employee', async () => {
      jest.spyOn(employeeMockRepository, 'find').mockResolvedValueOnce(
        new Promise<Employee[]>((resolve) => {
          const out = [];
          for (const employee of [testEmployee1, testEmployee2]) {
            if (employee.userId === newEmployeeDto.userId) {
              out.push(employee);
            }
          }
          resolve(out);
        }),
      );

      jest.spyOn(employeeMockRepository, 'save').mockResolvedValueOnce(
        new Promise<Employee>((resolve) => resolve(testEmployee3)),
      );
      expect(await service.create(newEmployeeDto)).toEqual(testEmployee3);
    });

    test('should return HttpException', async () => {
      jest.spyOn(employeeMockRepository, 'find').mockResolvedValueOnce(
        new Promise<Employee[]>((resolve) => {
          const out = [];
          for (const employee of [
            testEmployee1,
            testEmployee2,
            testEmployee3,
          ]) {
            if (employee.userId === newEmployeeDto.userId) {
              out.push(employee);
            }
          }
          resolve(out);
        }),
      );

      try {
        await service.create(newEmployeeDto);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });

  describe('delete', () => {
    test('should return message', async () => {
      jest.spyOn(employeeMockRepository, 'delete').mockResolvedValueOnce(
        new Promise<DeleteResult>((resolve) => {
          for (const employee of [
            testEmployee1,
            testEmployee2,
            testEmployee3,
          ]) {
            if (
              employee.userId === testEmployee1.userId &&
              employee.departmentId === testEmployee1.departmentId
            ) {
              resolve({
                affected: 1,
                raw: 0,
              });
            }
          }
          resolve({
            affected: 0,
            raw: 0,
          });
        }),
      );

      expect(
        await service.remove(testEmployee1.userId, testEmployee2.departmentId),
      ).toEqual({
        message: 'Employee deleted',
        status: HttpStatus.OK,
      });
    });

    test('should return HttpExteption', async () => {
      jest.spyOn(employeeMockRepository, 'delete').mockResolvedValueOnce(
        new Promise<DeleteResult>((resolve) => {
          for (const employee of [testEmployee2, testEmployee3]) {
            if (
              employee.userId === testEmployee1.userId &&
              employee.departmentId === testEmployee1.departmentId
            ) {
              resolve({
                affected: 1,
                raw: 0,
              });
            }
          }
          resolve({
            affected: 0,
            raw: 0,
          });
        }),
      );
      try {
        await service.remove(testEmployee1.userId, testEmployee2.departmentId);
      } catch (e) {
        expect(e).toBeInstanceOf(HttpException);
      }
    });
  });
});
