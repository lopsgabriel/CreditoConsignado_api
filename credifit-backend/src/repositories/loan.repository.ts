/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { LoanSchema } from 'src/schemas/loan.schemas';
import { LoanService } from 'src/services/loan.service';
import { Repository } from 'typeorm';
import { format } from 'date-fns';

@Injectable()
export class LoanRepository {
  constructor(
    private readonly loanService: LoanService,
    @InjectRepository(EmployeeModel)
    private readonly employeeRepository: Repository<EmployeeModel>,
    @InjectRepository(LoanModel)
    private readonly loanRepository: Repository<LoanModel>,
  ) {}
  //criar um empréstimo associado a um funcionário a partir do ID
  async requestLoan(id: number, loanSchema: LoanSchema): Promise<LoanModel> {
    //verificar se o funcionário existe
    const employee = await this.employeeRepository.findOne({ where: { id } });
    if (!employee) {
      throw new Error('Funcionário não encontrado');
    }

    //atribuir cpf ao empréstimo
    loanSchema.employeecpf = employee.cpf;

    //validar a margem de 35% do saláriodo funcionário
    const isValidMargin = await this.loanService.validateMargin(
      id,
      loanSchema.loanAmount,
    );
    if (!isValidMargin) {
      throw new Error(
        'Margem disponível excedida para o empréstimo solicitado',
      );
    }

    //validar score do usuário para aprovar o empréstimo
    const isValidScore = await this.loanService.validateScore(
      id,
      employee.salario,
    );
    if (!isValidScore) {
      console.log('Score mínimo não alcançado');
    } 

    if (isValidScore && isValidMargin){
      loanSchema.status = 'Aprovado';
    }
      

      //confirmar o pagamento
      const payment = await this.loanService.confirmPayment();
      if (payment) {
        console.log('Pagamento enviado com sucesso');
      } else {
        console.log('Falha ao enviar o pagamento');
      }

      const dataSolicitacao = new Date('2024-05-22')
      const numeroParcelas = loanSchema.loanInstallments
      const datasVencimento = await this.loanService.dueDate(dataSolicitacao, numeroParcelas)
      
      datasVencimento.forEach((data, index) => {
        console.log(`Parcela ${index + 1}: ${format(data, 'dd/MM/yyyy')}`);
      });
    

    return this.loanService.processLoanRequest(loanSchema);
  }

  //listar todos os empréstimos
  async getAll(): Promise<LoanModel[]> {
    return this.loanRepository.find();
  }

  //exibir um empréstimo específico com o loanId
  async getOne(loanId: number): Promise<LoanModel> {
    //verificar se o empréstimo existe
    const loan = await this.loanRepository.findOne({ where: { loanId } });
    if (!loan) {
      throw new Error(`Empréstimo com id ${loanId} não encontrado`);
    }
    return loan;
  }

  //atualizar um empréstimo pelo loanID
  async update(loanId: number, body: LoanSchema): Promise<LoanModel> {
    //verificar se o empréstimo existe
    const loan = await this.loanRepository.findOne({ where: { loanId } });
    if (!loan) {
      throw new Error(`Empréstimo com id ${loanId} não encontrado`);
    }
    await this.loanRepository.update(loanId, body);
    return this.loanRepository.findOne({ where: { loanId } });
  }

  //deletar um empréstimo pelo loanID
  async delete(loanId: number): Promise<string> {
    //verificar se o empréstimo existe
    const loan = await this.loanRepository.findOne({ where: { loanId } });
    if (!loan) {
      throw new Error(`Empréstimo com id ${loanId} não encontrado`);
    }
    await this.loanRepository.delete(loanId);
    return `Empréstimo com id ${loanId} foi deletado`;
  }
}
