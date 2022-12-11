import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Employee {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  userId: string;

  @Column()
  departmentId: string;

  @Column({ type: 'date', default: new Date(Date.now()) })
  date: Date;
}
