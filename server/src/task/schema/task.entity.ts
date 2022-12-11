import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export enum EPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  urgent = 'urgent'
}

export enum EStatus {
  TODO = 'todo',
  WIP = 'wip',
  DONE = 'done',
}

@Entity()
export class Task {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  title: string;

  @Column()
  priority: EPriority;

  @Column()
  status: EStatus

  @Column()
  assignedToId: string;

  @Column()
  description: string;

  @Column()
  departmentId: string;

  @Column({ type: 'date', default: new Date(Date.now()) })
  created_at: Date;

  @Column({ type: 'date', default: new Date(Date.now()) })
  started_at: Date;

  @Column({ type: 'date' })
  ended_at: Date;
}
