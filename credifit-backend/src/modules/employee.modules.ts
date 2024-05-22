/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EmployeeController } from 'src/controllers/employee.controller';
import { CompanyModel } from 'src/model/company.model';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { EmployeeRepository } from 'src/repositories/employee.repository';



@Module({
  imports: [TypeOrmModule.forFeature([EmployeeModel, LoanModel, CompanyModel])],
  providers: [EmployeeRepository],
  controllers: [EmployeeController],
})
export class EmployeeModule {}
