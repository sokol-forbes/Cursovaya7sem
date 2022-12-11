// import { Address } from './src/address/scheme/address.entity';
// import { Department } from './src/department/scheme/department.entity';
// import { Employee } from './src/employee/scheme/employee.entity';
// import { Task } from './src/task/schema/task.entity';

const { ERole, User } = require('./src/user/scheme/user.entity');
const { faker } = require('@faker-js/faker');
const { EPriority, EStatus } = require('./src/task/schema/task.entity');

const address = {
  street: () => faker.address.street(),
  home: () => Number(faker.address.buildingNumber()),
  flat: () => Number(faker.address.buildingNumber()),
};

const user = {
  email: () => faker.internet.email(),
  role: () => ERole.COMMON,
  name: () => faker.name.firstName(),
  password: () => 'qwerty1!',
  surname: () => faker.name.lastName(),
  skils: () => {
    const rand = Math.random() * 10;
    let res = '';
    for (let i = 0; i < rand; i++) {
      res += faker.science.chemicalElement();
    }

    return res;
  },
  addressId: () => 1,
};

const department = {
  name: faker.company.name(),
  type: faker.internet.domainName(),
  bossId: (id) => id,
};

const employee = {
  userId: (id) => id,
  departmentId: (id) => id,
};

const task = {
  title: () => faker.lorem.words(),

  priority: () => {
    const rand = Math.random();

    if (rand < 20) {
      return EPriority.LOW;
    }
    if (rand < 50) {
      return EPriority.HIGH;
    }
    if (rand < 75) {
      return EPriority.urgent;
    }

    return EPriority.MEDIUM;
  },

  status: () => {
    const rand = Math.random();

    if (rand < 30) {
      return EStatus.DONE;
    }
    if (rand < 60) {
      return EStatus.TODO;
    }

    return EStatus.WIP;
  },

  assignedToId: (id) => id,

  description: () =>
    faker.lorem.sentences(Number((Math.random() * 5).toFixed(0)), '\n'),

  departmentId: (id) => id,

  ended_at: () => {
    const date = new Date();

    const rand = Math.random();

    if (rand < 10) {
      const rand = Math.random() * 10 + 1;

      date.setFullYear(date.getFullYear() + rand);

      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }

    if (rand < 60) {
      const rand = Math.random() * 10 + 1;

      date.setMonth(date.getMonth() + rand);

      return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    }
    const randd = Math.random() * 10 + 1;

    date.setDate(date.getDate() + randd);

    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
  },
};

// import { DataSource } from 'typeorm';

// const myDataSource = new DataSource({
//   type: 'postgres',
//   host: 'localhost',
//   port: 5432,
//   username: 'qwerty',
//   password: 'qwerty',
//   database: 'company',
//   entities: [User, Department, Task, Employee, Address],
//   logging: true,
//   synchronize: false,
// });

// myDataSource
//   .initialize()
//   .then(() => {
//     console.log('Data Source has been initialized!');
//   })
//   .catch((err) => {
//     console.error('Error during Data Source initialization:', err);
//   });

// const create = () => {};

console.log(department)
