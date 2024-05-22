/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';



@Entity()
export class EmployeeModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cpf: string;

  @Column({ unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  salario: number;

  @Column({ nullable: true })
  empresa: string;

}
