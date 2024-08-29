/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoanRepository } from 'src/repositories/loan.repository';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { LoanService } from 'src/services/loan.service';
import { LoanSchema } from 'src/schemas/loan.schemas';

describe('LoanRepository', () => {
  let repository: LoanRepository;
  let loanService: LoanService;
  let employeeRepository: Repository<EmployeeModel>;
  let loanRepository: Repository<LoanModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanRepository,
        LoanService,
        {
          provide: getRepositoryToken(EmployeeModel),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(LoanModel),
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<LoanRepository>(LoanRepository);
    loanService = module.get<LoanService>(LoanService);
    employeeRepository = module.get<Repository<EmployeeModel>>(
      getRepositoryToken(EmployeeModel),
    );
    loanRepository = module.get<Repository<LoanModel>>(
      getRepositoryToken(LoanModel),
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('requestLoan', () => {
    it('should request a loan', async () => {
      const id = 1;
      const loanSchema = {
        loanAmount: 1000,
        employeecpf: '12345678901',
        loanInstallments: 10,
        installment: 100,
      };
      const employee: EmployeeModel = {
        id: 1,
        name: 'Gabriel',
        cpf: '12345678901',
        salario: 3000,
        email: 'gabriel@gmail.com',
        password: 'password',
        empresa: 'Credifit',
      };
      const createdLoan: LoanModel = {
        loanId: 1,
        employeecpf: loanSchema.employeecpf,
        loanAmount: loanSchema.loanAmount,
        loanInstallments: loanSchema.loanInstallments,
        installment: loanSchema.installment,
        status: 'Aprovado',
      };

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(employee);
      jest.spyOn(loanService, 'validateMargin').mockResolvedValue(true);
      jest.spyOn(loanService, 'validateScore').mockResolvedValue(true);
      jest.spyOn(loanService, 'confirmPayment').mockResolvedValue(true);
      jest
        .spyOn(loanService, 'processLoanRequest')
        .mockResolvedValue(createdLoan);

      const result = await repository.requestLoan(id, loanSchema);

      expect(result).toEqual(createdLoan);
    });

    it('should throw Error if employee is not found', async () => {
      const id = 1;
      const loanSchema = {
        loanAmount: 1000,
        employeecpf: '12345678901',
        loanInstallments: 10,
        installment: 100,
      };

      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(undefined);

      await expect(repository.requestLoan(id, loanSchema)).rejects.toThrow(
        'Funcionário não encontrado',
      );
    });
  });

  describe('getAll', () => {
    it('should get all loans', async () => {
      const loans: LoanModel[] = [
        {
          loanId: 1,
          employeecpf: '12345678901',
          loanAmount: 1000,
          loanInstallments: 10,
          installment: 100,
          status: 'Aprovado',
        },
        {
          loanId: 2,
          employeecpf: '12345678901',
          loanAmount: 2000,
          loanInstallments: 20,
          installment: 100,
          status: 'Aprovado',
        },
      ];
      jest.spyOn(loanRepository, 'find').mockResolvedValue(loans);

      const result = await repository.getAll();

      expect(result).toEqual(loans);
    });
  });

  describe('getOne', () => {
    it('should get one loan', async () => {
      const loanId = 1;
      const loan: LoanModel = {
        loanId: loanId,
        employeecpf: '12345678901',
        loanAmount: 1000,
        loanInstallments: 10,
        installment: 100,
        status: 'Aprovado',
      };
      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(loan);

      const result = await repository.getOne(loanId);

      expect(result).toEqual(loan);
    });

    it('should throw Error if loan is not found', async () => {
      const loanId = 1;
      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(undefined);

      await expect(repository.getOne(loanId)).rejects.toThrow(
        `Empréstimo com id 1 não encontrado`,
      );
    });
  });

  describe('update', () => {
    it('should update one loan', async () => {
      const loanId = 1;
      const updatedLoanSchema: LoanSchema = {
        employeecpf: '12345678901',
        loanAmount: 2000,
        loanInstallments: 20,
        installment: 100,
        status: 'Aprovado',
      };
      const updatedLoan: LoanModel = {
        loanId: loanId,
        employeecpf: '12345678901',
        loanAmount: 2000,
        loanInstallments: 20,
        installment: 100,
        status: 'Aprovado',
      };

      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(updatedLoan);
      jest.spyOn(loanRepository, 'update').mockResolvedValue(undefined);
      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(updatedLoan);

      const result = await repository.update(loanId, updatedLoanSchema);

      expect(result).toEqual(updatedLoan);
    });

    it('should throw Error if loan is not found', async () => {
      const loanId = 1;
      const updatedLoanSchema: LoanSchema = {
        employeecpf: '12345678901',
        loanAmount: 2000,
        loanInstallments: 20,
        installment: 100,
        status: 'Aprovado',
      };
      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(undefined);

      await expect(
        repository.update(loanId, updatedLoanSchema),
      ).rejects.toThrow(`Empréstimo com id 1 não encontrado`);
    });
  });

  describe('delete', () => {
    it('should delete one loan', async () => {
      const loanId = 1;
      const loan: LoanModel = {
        loanId: loanId,
        employeecpf: '12345678901',
        loanAmount: 1000,
        loanInstallments: 10,
        installment: 100,
        status: 'Aprovado',
      };
      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(loan);
      jest.spyOn(loanRepository, 'delete').mockResolvedValue(undefined);

      const result = await repository.delete(loanId);

      expect(result).toEqual(`Empréstimo com id ${loanId} foi deletado`);
    });

    it('should throw Error if loan is not found', async () => {
      const loanId = 1;
      jest.spyOn(loanRepository, 'findOne').mockResolvedValue(undefined);

      await expect(repository.delete(loanId)).rejects.toThrow(
        `Empréstimo com id 1 não encontrado`,
      );
    });
  });
});
