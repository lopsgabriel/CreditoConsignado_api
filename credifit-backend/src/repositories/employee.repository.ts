/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyModel } from 'src/model/company.model';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { EmployeeSchema } from 'src/schemas/employee.schemas';
import { Repository } from 'typeorm';

@Injectable()
export class EmployeeRepository {
  constructor(
    @InjectRepository(EmployeeModel)
    private readonly employeeRe: Repository<EmployeeModel>,
    @InjectRepository(LoanModel)
    private readonly loanRe: Repository<LoanModel>,
    @InjectRepository(CompanyModel)
    private companyRe: Repository<CompanyModel>,
  ) {}
  
  //Criar um funcionário registrado a uma empresa
  async createEmployee(employeeData: EmployeeSchema): Promise<EmployeeModel> {
    try {
      // Verificar se a empresa existe antes de criar o funcionário
      const company = await this.companyRe.findOne({
        where: { razaosocial: employeeData.empresa },
      });
      if (!company) {
        throw new Error('Empresa não encontrada');
      }

      const newEmployee = this.employeeRe.create(employeeData);
      return await this.employeeRe.save(newEmployee);
    } catch (error) {
      throw new Error('Não foi possível criar o funcionário');
    }
  }

  //listar todos os funcionários
  async getAllEmployees(): Promise<EmployeeModel[]> {
    try {
      return await this.employeeRe.find();
    } catch (error) {
      throw new Error('Erro ao buscar funcionários');
    }
  }

  //exibir um funcionário a partir do ID
  async getEmployeeById(id: number): Promise<EmployeeModel> {
    try {
      //verificar se o funcionário existe
      const employee = await this.employeeRe.findOne({ where: { id } });
      if (!employee) {
        throw new Error(
          `Não foi possível encontrar o funcionário com o ID: ${id}`,
        );
      }
      return employee;
    } catch (error) {
      throw new Error('Erro ao buscar funcionário por ID');
    }
  }

  //atualizar funcionário
  async updateEmployee(
    id: number,
    employeeData: EmployeeSchema,
  ): Promise<EmployeeModel> {
    try {
      //verificar se o funcionário existe
      const existingEmployee = await this.employeeRe.findOne({ where: { id } });
      if (!existingEmployee) {
        throw new Error(
          `Não foi possível encontrar o funcionário com o ID: ${id}`,
        );
      }

      await this.employeeRe.update(id, employeeData);
      return await this.employeeRe.findOne({ where: { id } });
    } catch (error) {
      throw new Error('Erro ao atualizar o funcionário');
    }
  }

  //deletar funcionário
  async deleteEmployee(id: number): Promise<void> {
    try {
      //verificar se o funcionário existe
      const existingEmployee = await this.employeeRe.findOne({ where: { id } });
      if (!existingEmployee) {
        throw new Error(
          `Não foi possível encontrar o funcionário com o ID: ${id}`,
        );
      }

      await this.employeeRe.delete(id);
    } catch (error) {
      throw new Error('Erro ao deletar o funcionário');
    }
  }

  //exibir todos os empréstimos de um funcionário
  async findLoansByEmployeeCpf(employeecpf: string): Promise<LoanModel[]> {
    try {
      //verificar os empréstimos associados ao cpf de um funcionário
      const loans = await this.loanRe.find({ where: { employeecpf } });
      if (!loans || loans.length === 0) {
        throw new Error(
          `Nenhum empréstimo vinculado a este CPF: ${employeecpf}`,
        );
      }
      return loans;
    } catch (error) {
      throw new Error('Erro ao buscar empréstimos vinculados ao CPF');
    }
  }
}
