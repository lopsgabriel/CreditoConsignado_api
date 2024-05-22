/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from 'src/controllers/company.controller';
import { CompanyModel } from 'src/model/company.model';
import { CompanyRepository } from 'src/repositories/company.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyModel])],
  providers: [CompanyRepository],
  controllers: [CompanyController],
})
export class CompanyModule {}
