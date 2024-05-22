/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { addMonths } from 'date-fns';
import { Injectable, Param, ParseIntPipe } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { LoanSchema } from 'src/schemas/loan.schemas';
import { Repository } from 'typeorm';
import axios from 'axios';

@Injectable()
export class LoanService {
  constructor(
    @InjectRepository(LoanModel)
    private readonly loanRepository: Repository<LoanModel>,
    @InjectRepository(EmployeeModel)
    private employeeRe: Repository<EmployeeModel>,
  ) {}

  async processLoanRequest(loanSchema: LoanSchema): Promise<LoanModel> {
    const newloan = new LoanSchema();
    newloan.loanAmount = loanSchema.loanAmount;
    newloan.loanInstallments = loanSchema.loanInstallments;
    newloan.employeecpf = loanSchema.employeecpf;
    newloan.installment = parseFloat((loanSchema.loanAmount / loanSchema.loanInstallments).toFixed(2));
    newloan.status = loanSchema.status;

    return this.loanRepository.save(newloan);
  }

  //verificar a margem disponível de 35% do salário do funcionário
  async validateMargin(
    @Param('id', ParseIntPipe) id: number,
    loanAmount: number,
  ): Promise<boolean> {
    //verificar se o funcionário existe
    const employee = await this.employeeRe.findOne({ where: { id } });

    if (!employee) {
      throw new Error('Funcionário não encontrado');
    }

    //difinir valor máximo disponivel para empréstimo
    const maxAllowedLoan = employee.salario * 0.35;

    //retornar um valor booleano true se o valor do empréstimo for menor ou igual o valor maximo definido
    return loanAmount <= maxAllowedLoan;
  }

  //puxar o score do funcionário com o mocky disponibilizado, retornando o valor do score ouum valor nulo
  async getScore(): Promise<number | null>{
    try {
      const scoreMocky = await axios.get(
        'https://run.mocky.io/v3/ef99c032-8e04-4e6a-ad3e-6f413a9e707a',
      );

      const scoreSimulado = await scoreMocky.data.score;

      return await scoreSimulado;
    } catch (error) {
      console.error('Erro ao obter o score:', error.message);
      return null;
    }
  }

  //validar score do usuário
  async validateScore(
    @Param('id', ParseIntPipe) id: number,
    salario: number,
  ): Promise<boolean> {
    const scoreSimulado = await this.getScore();

    //definir um score mínimo necessário
    if (!scoreSimulado !== null) {
      let scoreMinNecessario = 0;
      if (salario <= 2000) {
        scoreMinNecessario = 400;
      } else if (salario <= 4000) {
        scoreMinNecessario = 500;
      } else if (salario <= 8000) {
        scoreMinNecessario = 600;
      } else {
        scoreMinNecessario = 700;
      }

      //retornar um valor booleano true se o score for maior que o score mínimo necessário 
      return (await scoreSimulado) >= scoreMinNecessario;
    } else {
      return false;
    }
  }

  //validar pagamento do empréstimo com o mocky disponibilizado
  async confirmPayment(): Promise<boolean> {
    try {
      const responseMocky = await axios.post(
        'https://run.mocky.io/v3/ed999ce0-d115-4f73-b098-6277aabbd144',
      );
      const pagamentoProcessado = responseMocky.data.ok;

      return pagamentoProcessado;
    } catch (error) {
      console.error(
        'Erro ao enviar o pagamento, serviço indisponível ou instavel:',
        error.message,
      );
      return false;
    }
  }

  //calcula data de vencimento
  async dueDate(dataSolicitacao: Date, numeroParcelas: number): Promise<Date[]> {
    const datasVencimento: Date[] = [];
    let dataVencimento = dataSolicitacao;

    for (let i = 0; i < numeroParcelas; i++) {
        // Adiciona um mês à data de vencimento anterior
        dataVencimento = addMonths(dataVencimento, 1);
        datasVencimento.push(dataVencimento);
    }

    return datasVencimento;
}
}
