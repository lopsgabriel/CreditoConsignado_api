/* eslint-disable prettier/prettier */
import { PrimaryGeneratedColumn, Column, Entity } from 'typeorm';

@Entity()
export class CompanyModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  cnpj: string;

  @Column({ unique: true })
  cpf: string;

  @Column({unique: true})
  email: string;

  @Column()
  password: string;

  @Column()
  razaosocial: string;
}
