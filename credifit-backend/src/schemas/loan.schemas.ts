/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class LoanSchema {
  @IsString()
  employeecpf: string;

  @IsNumber()
  @IsNotEmpty()
  loanAmount: number;

  //Se o número de parcelas não for definido, o sistema automaticamente defini como 1 parcela
  @IsOptional()
  @IsNumber()
  @Min(1)
  loanInstallments: number;

  @IsNumber()
  installment: number;

  @IsOptional()
  @IsString()
  status?: string;
}
