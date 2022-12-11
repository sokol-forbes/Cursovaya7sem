import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Department {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  name: string;

  @Column()
  type: string;

  @Column()
  bossId: string;

  @Column({ default: 1 })
  count: number;

  @Column({ type: 'date', default: new Date(Date.now()) })
  date: Date;

  @Column({ type: 'date', default: new Date(Date.now()) })
  update: Date;
}
