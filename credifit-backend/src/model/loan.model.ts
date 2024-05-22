/* eslint-disable prettier/prettier */
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';



@Entity()
export class LoanModel {
  @PrimaryGeneratedColumn()
  loanId: number;

  @Column()
  employeecpf: string;

  @Column({ type: 'float' })
  loanAmount: number;

  @Column({ type: 'integer', default: 1 })
  loanInstallments: number;

  //limita para 2 algoritimos após a vírgula
  @Column('decimal', { precision: 10, scale: 2 })
  installment: number; 

  @Column({ default: 'Rejeitado'})
  status: string;
}
