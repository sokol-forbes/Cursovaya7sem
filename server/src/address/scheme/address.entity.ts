import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Address {
  @PrimaryGeneratedColumn()
  id: string;

  @Column()
  street: string;

  @Column()
  home: number;

  @Column()
  flat: number;
}
