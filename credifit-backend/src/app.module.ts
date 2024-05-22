/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { EmployeeModule } from './modules/employee.modules';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConnectOptions } from 'typeorm';
import { CompanyModule } from './modules/company.module';
import { LoanModule } from './modules/loan.module';

@Module({
  imports: [
    EmployeeModule,
    CompanyModule,
    LoanModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      database: 'credifit',
      port: 7878,
      username: 'postgres',
      synchronize: true,
      password: '12345',
      entities: ['dist/**/*.model.js'],
    } as ConnectOptions),
  ],
})
export class AppModule {}
