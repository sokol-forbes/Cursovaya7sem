import { Address } from '../../address/scheme/address.entity';
import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

export enum ERole {
  ADMIN = 'admin',
  COMMON = 'common',
  BOSS = 'boss',
}

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ default: ERole.COMMON })
  role: ERole;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column()
  surname: string;

  @Column()
  skils: string;

  @OneToOne(() => Address)
  @JoinColumn()
  addressId: Address;

  @Column({ type: 'date', default: new Date(Date.now()) })
  date: Date;
}
