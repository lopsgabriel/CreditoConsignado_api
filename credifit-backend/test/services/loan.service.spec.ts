/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import axios from 'axios';
import { LoanService } from 'src/services/loan.service';
import { LoanModel } from 'src/model/loan.model';
import { EmployeeModel } from 'src/model/employee.model';

jest.mock('axios');

describe('LoanService', () => {
  let service: LoanService;
  let loanRepository: Repository<LoanModel>;
  let employeeRepository: Repository<EmployeeModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LoanService,
        {
          provide: getRepositoryToken(LoanModel),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(EmployeeModel),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
    loanRepository = module.get<Repository<LoanModel>>(
      getRepositoryToken(LoanModel),
    );
    employeeRepository = module.get<Repository<EmployeeModel>>(
      getRepositoryToken(EmployeeModel),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processLoanRequest', () => {
    it('should save a new loan', async () => {
      const loanSchema = {
        loanAmount: 1000,
        loanInstallments: 10,
        employeecpf: '12345678900',
        installment: 100,
        status: 'Aprovado',
      };

      jest
        .spyOn(loanRepository, 'save')
        .mockResolvedValue(loanSchema as LoanModel);

      const result = await service.processLoanRequest(loanSchema);

      expect(result).toEqual(loanSchema);
      expect(loanRepository.save).toHaveBeenCalledWith({
        ...loanSchema,
        installment: parseFloat(
          (loanSchema.loanAmount / loanSchema.loanInstallments).toFixed(2),
        ),
      });
    });
  });

  describe('validateMargin', () => {
    it('should return true if margin is valid', async () => {
      const employee = { id: 1, salario: 3000 };
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValue(employee as EmployeeModel);

      const result = await service.validateMargin(1, 1000);
      expect(result).toBe(true);
    });

    it('should return false if margin is exceeded', async () => {
      const employee = { id: 1, salario: 3000 };
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValue(employee as EmployeeModel);

      const result = await service.validateMargin(1, 2000);
      expect(result).toBe(false);
    });

    it('should throw an error if employee is not found', async () => {
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValue(null);

      await expect(service.validateMargin(1, 1000)).rejects.toThrow(
        'Funcionário não encontrado',
      );
    });
  });

  describe('getScore', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should return score if API call is successful', async () => {
      const score = { data: { score: 500 } };
      (axios.get as jest.Mock).mockResolvedValue(score);

      const result = await service.getScore();
      expect(result).toBe(500);
    });

    it('should return null if API call fails', async () => {
      (axios.get as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await service.getScore();
      expect(result).toBeNull();
    });
  });

  describe('validateScore', () => {
    it('should return true if score is valid', async () => {
      jest.spyOn(service, 'getScore').mockResolvedValue(600);

      const result = await service.validateScore(1, 5000);
      expect(result).toBe(true);
    });

    it('should return false if score is not valid', async () => {
      jest.spyOn(service, 'getScore').mockResolvedValue(300);

      const result = await service.validateScore(1, 5000);
      expect(result).toBe(false);
    });

    it('should return false if score is null', async () => {
      jest.spyOn(service, 'getScore').mockResolvedValue(null);

      const result = await service.validateScore(1, 5000);
      expect(result).toBe(false);
    });
  });

  describe('confirmPayment', () => {
    let consoleErrorSpy: jest.SpyInstance;

    beforeEach(() => {
      consoleErrorSpy = jest
        .spyOn(console, 'error')
        .mockImplementation(() => {});
    });

    afterEach(() => {
      consoleErrorSpy.mockRestore();
    });

    it('should return true if payment is confirmed', async () => {
      const response = { data: { ok: true } };
      (axios.post as jest.Mock).mockResolvedValue(response);

      const result = await service.confirmPayment();
      expect(result).toBe(true);
    });

    it('should return false if payment is not confirmed', async () => {
      const response = { data: { ok: false } };
      (axios.post as jest.Mock).mockResolvedValue(response);

      const result = await service.confirmPayment();
      expect(result).toBe(false);
    });

    it('should return false if API call fails', async () => {
      (axios.post as jest.Mock).mockRejectedValue(new Error('API error'));

      const result = await service.confirmPayment();
      expect(result).toBe(false);
    });
  });
});
