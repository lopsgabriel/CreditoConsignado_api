/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Body, Controller, Delete, Get, Param, ParseIntPipe, Post, Put } from "@nestjs/common";
import { CompanyModel } from 'src/model/company.model';
import { CompanyRepository } from 'src/repositories/company.repository';
import { CompanySchema } from 'src/schemas/company.schemas';

@Controller('/empresa')
export class CompanyController {
  constructor(private readonly companyRepository: CompanyRepository) {}

  @Post()
  async create(@Body() companyData: CompanySchema): Promise<CompanyModel> {
    try {
      return await this.companyRepository.createCompany(companyData);
    } catch (error) {
      throw new Error('Erro ao criar empresa');
    }
  }

  @Get()
  async getAll(): Promise<CompanyModel[]> {
    try {
      return await this.companyRepository.getAllCompanies();
    } catch (error) {
      throw new Error('Erro ao buscar empresas');
    }
  }

  @Get(':id')
  async getOne(@Param('id', ParseIntPipe) id: number): Promise<CompanyModel> {
    try {
      return await this.companyRepository.getCompanyById(id);
    } catch (error) {
      throw new Error('Erro ao buscar empresa por ID');
    }
  }

  @Put(':id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() companyData: CompanySchema,
  ): Promise<CompanyModel> {
    try {
      return await this.companyRepository.updateCompany(id, companyData);
    } catch (error) {
      throw new Error('Erro ao atualizar empresa');
    }
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<void> {
    try {
      await this.companyRepository.deleteCompany(id);
    } catch (error) {
      throw new Error('Erro ao deletar empresa');
    }
  }
}
