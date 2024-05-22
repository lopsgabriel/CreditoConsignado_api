/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CompanyModel } from 'src/model/company.model';
import { CompanySchema } from 'src/schemas/company.schemas';
import { Repository } from 'typeorm';

@Injectable()
export class CompanyRepository {
  constructor(
    @InjectRepository(CompanyModel)
    private companyRe: Repository<CompanyModel>,
  ) {}
  
  //Criar uma empresa conveniada
  async createCompany(companyData: CompanySchema): Promise<CompanyModel> {
    const newCompany = this.companyRe.create(companyData);
    return await this.companyRe.save(newCompany);
  }

  //listar todas as empresas conveniadas registradas
  async getAllCompanies(): Promise<CompanyModel[]> {
    return await this.companyRe.find();
  }

  //exibir empresa específica a partir do ID
  async getCompanyById(id: number): Promise<CompanyModel> {
    const company = await this.companyRe.findOne({ where: { id } });
    if (!company) {
      throw new Error(`Não foi possível encontrar uma empresa com o ID: ${id}`);
    }
    return await this.companyRe.findOne({ where: { id } });
  }

  //atualizar as informações de uma empresa
  async updateCompany(
    id: number,
    companyData: CompanySchema,
  ): Promise<CompanyModel> {
    const company = await this.companyRe.findOne({ where: { id } });

    if (!company) {
      throw new Error(`Não foi possível encontrar uma empresa com o ID: ${id}`);
    }

    await this.companyRe.update({ id }, companyData);
    return await this.companyRe.findOne({ where: { id } });
  }

  //deletar uma empresa
  async deleteCompany(id: number): Promise<string> {
    const company = await this.companyRe.findOne({ where: { id } });

    if (!company) {
      throw new Error(`Não foi possível encontrar uma empresa com o ID: ${id}`);
    }

    await this.companyRe.delete(id);

    return `Empresa com ID ${id} foi deletada`;
  }
}
