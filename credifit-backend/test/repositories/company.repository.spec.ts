/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CompanyModel } from 'src/model/company.model';
import { CompanyRepository } from 'src/repositories/company.repository';
import { CompanySchema } from 'src/schemas/company.schemas';

import { Repository } from 'typeorm';

describe('CompanyRepository', () => {
  let repository: CompanyRepository;
  let companyModelRepository: Repository<CompanyModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CompanyRepository,
        {
          provide: getRepositoryToken(CompanyModel),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<CompanyRepository>(CompanyRepository);
    companyModelRepository = module.get<Repository<CompanyModel>>(
      getRepositoryToken(CompanyModel),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createCompany', () => {
    it('should create a new company', async () => {
      const companyData = {
        name: 'credifit',
        cnpj: '12345678901234',
        cpf: '12345678901',
        email: 'credifit@gmail.com',
        password: 'password123',
        razaosocial: 'Credifit LTDA',
      };

      const createdCompany = {
        id: 1,
        ...companyData,
      };

      jest
        .spyOn(companyModelRepository, 'create')
        .mockReturnValue(createdCompany);
      jest
        .spyOn(companyModelRepository, 'save')
        .mockResolvedValue(createdCompany);

      const result = await repository.createCompany(companyData);

      expect(result).toEqual(createdCompany);
    });
  });
 
  describe('getAllCompanies', () => {
    it('should return all companies', async () => {
      const companies: CompanyModel[] = [
        {
          id: 1,
          name: 'credifit 1',
          cnpj: '123456789012314',
          cpf: '123456789011',
          email: 'credifit1@gmail.com',
          password: 'password1231',
          razaosocial: 'Credifit 1 LTDA',
        },
        {
          id: 2,
          name: 'credifit 2' ,
          cnpj: '123456789012324',
          cpf: '123456789021',
          email: 'credifit2@gmail.com',
          password: 'password1232',
          razaosocial: 'Credifit 2 LTDA',
        },
      ];
      jest.spyOn(companyModelRepository, 'find').mockResolvedValue(companies);

      const result = await repository.getAllCompanies();

      expect(result).toEqual(companies);
    });
  });

  describe('getCompanyById', () => {
    it('should return a company by ID', async () => {
      const companyId = 1;
      const company = {
        id: companyId,
        name: 'credifit',
        cnpj: '12345678901234',
        cpf: '12345678901',
        email: 'credifit@gmail.com',
        password: 'password123',
        razaosocial: 'Credifit LTDA',
      };
      jest.spyOn(companyModelRepository, 'findOne').mockResolvedValue(company);

      const result = await repository.getCompanyById(companyId);

      expect(result).toEqual(company);
    });

    it('should throw an error if company is not found', async () => {
      const companyId = 1;
      jest
        .spyOn(companyModelRepository, 'findOne')
        .mockResolvedValue(undefined);

      await expect(repository.getCompanyById(companyId)).rejects.toThrow(
        `Não foi possível encontrar uma empresa com o ID: 1`,
      );
    });
  });

  describe('updateCompany', () => {
    it('should update a company', async () => {
      const companyId = 1;
      const companyData: CompanySchema = {
        name: 'credifit',
        cnpj: '12345678901234',
        cpf: '12345678901',
        email: 'credifit@gmail.com',
        password: 'password123',
        razaosocial: 'Credifit LTDA',
      };;
      const updatedCompany: CompanyModel = {
        id: companyId,
        name: 'credifit',
        cnpj: '12345678901234',
        cpf: '12345678901',
        email: 'credifit@gmail.com',
        password: 'password123',
        razaosocial: 'Credifit LTDA',
      };
      jest
        .spyOn(companyModelRepository, 'findOne')
        .mockResolvedValue(updatedCompany);
      jest.spyOn(companyModelRepository, 'update').mockResolvedValue(undefined);
      jest
        .spyOn(companyModelRepository, 'findOne')
        .mockResolvedValue(updatedCompany);

      const result = await repository.updateCompany(companyId, companyData);

      expect(result).toEqual(updatedCompany);
    });

    it('should throw an error if company is not found', async () => {
      const companyId = 1;
      const companyData: CompanySchema = {
        name: 'credifit',
        cnpj: '12345678901234',
        cpf: '12345678901',
        email: 'credifit@gmail.com',
        password: 'password123',
        razaosocial: 'Credifit LTDA',
      };
      jest
        .spyOn(companyModelRepository, 'findOne')
        .mockResolvedValue(undefined);

      await expect(
        repository.updateCompany(companyId, companyData),
      ).rejects.toThrow(`Não foi possível encontrar uma empresa com o ID: 1`);
    });
  });

  describe('deleteCompany', () => {
    it('should delete a company', async () => {
      const companyId = 1;
      const company = {
        id: companyId,
        name: 'credifit',
        cnpj: '12345678901234',
        cpf: '12345678901',
        email: 'credifit@gmail.com',
        password: 'password123',
        razaosocial: 'Credifit LTDA',
      };
      jest.spyOn(companyModelRepository, 'findOne').mockResolvedValue(company);
      jest.spyOn(companyModelRepository, 'delete').mockResolvedValue(undefined);

      const result = await repository.deleteCompany(companyId);

      expect(result).toEqual(`Empresa com ID ${companyId} foi deletada`);
    });

    it('should throw an error if company is not found', async () => {
      const companyId = 1;
      jest
        .spyOn(companyModelRepository, 'findOne')
        .mockResolvedValue(undefined);

      await expect(repository.deleteCompany(companyId)).rejects.toThrow(
        `Não foi possível encontrar uma empresa com o ID: 1`,
      );
    });
  });
});
