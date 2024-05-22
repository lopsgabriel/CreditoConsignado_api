/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Controller, Get, Post, Body, Put, Delete, Param, ParseIntPipe, } from '@nestjs/common';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { EmployeeRepository } from 'src/repositories/employee.repository';
import { EmployeeSchema } from 'src/schemas/employee.schemas';

@Controller('/funcionario')
export class EmployeeController {
  constructor(private readonly employeeRepository: EmployeeRepository) {}

  @Post()
  async create(@Body() employeeData: EmployeeSchema): Promise<EmployeeModel> {
    try {
      return await this.employeeRepository.createEmployee(employeeData);
    } catch (error) {
      throw new Error('Erro ao criar funcionário');
    }
  }

  @Get()
  async getAll(): Promise<EmployeeModel[]> {
    try {
      return await this.employeeRepository.getAllEmployees();
    } catch (error) {
      throw new Error('Erro ao buscar funcionários');
    }
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<EmployeeModel> {
    try {
      return await this.employeeRepository.getEmployeeById(id);
    } catch (error) {
      throw new Error('Erro ao buscar funcionário por ID');
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: EmployeeSchema,
  ): Promise<EmployeeModel> {
    try {
      return await this.employeeRepository.updateEmployee(id, body);
    } catch (error) {
      throw new Error('Erro ao atualizar funcionário');
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.employeeRepository.deleteEmployee(id);
    } catch (error) {
      throw new Error('Erro ao deletar funcionário');
    }
  }

  @Get('/emprestimos/:employeecpf')
  async getLoansByEmployeeCpf(
    @Param('employeecpf') employeecpf: string,
  ): Promise<LoanModel[]> {
    try {
      return await this.employeeRepository.findLoansByEmployeeCpf(employeecpf);
    } catch (error) {
      throw new Error('Erro ao buscar empréstimos vinculados ao CPF');
    }
  }
}
