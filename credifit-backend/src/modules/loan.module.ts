/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LoanController } from 'src/controllers/loan.controller';
import { LoanModel } from 'src/model/loan.model';
import { LoanService } from 'src/services/loan.service';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanRepository } from 'src/repositories/loan.repository';



@Module({
  imports: [TypeOrmModule.forFeature([LoanModel, EmployeeModel])],
  providers: [LoanService, LoanRepository], 
  controllers: [LoanController],
})
export class LoanModule {}
