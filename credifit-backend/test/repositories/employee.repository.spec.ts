/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CompanyModel } from 'src/model/company.model';
import { EmployeeModel } from 'src/model/employee.model';
import { LoanModel } from 'src/model/loan.model';
import { EmployeeRepository } from 'src/repositories/employee.repository';
import { Repository } from 'typeorm';

describe('EmployeeRepository', () => {
  let repository: EmployeeRepository;
  let employeeRepository: Repository<EmployeeModel>;
  let loanRepository: Repository<LoanModel>;
  let companyRepository: Repository<CompanyModel>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmployeeRepository,
        {
          provide: 'EmployeeModelRepository',
          useClass: Repository,
        },
        {
          provide: 'LoanModelRepository',
          useClass: Repository,
        },
        {
          provide: 'CompanyModelRepository',
          useClass: Repository,
        },
      ],
    }).compile();

    repository = module.get<EmployeeRepository>(EmployeeRepository);
    employeeRepository = module.get<Repository<EmployeeModel>>(
      'EmployeeModelRepository',
    );
    loanRepository = module.get<Repository<LoanModel>>('LoanModelRepository');
    companyRepository = module.get<Repository<CompanyModel>>(
      'CompanyModelRepository',
    );
  });

  it('should be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('createEmployee', () => {
    it('should create a new employee', async () => {
      const employeeData = {
        name: 'Gabriel',
        cpf: '12345678901',
        email: 'gabriel@gmail.com',
        password: 'password',
        salario: 3000,
        empresa: 'credifit',
      }; 
      const employeeModel = new EmployeeModel();
      jest
        .spyOn(companyRepository, 'findOne')
        .mockResolvedValueOnce(new CompanyModel());
      jest
        .spyOn(employeeRepository, 'create')
        .mockReturnValueOnce(employeeModel);
      jest
        .spyOn(employeeRepository, 'save')
        .mockResolvedValueOnce(employeeModel);

      const result = await repository.createEmployee(employeeData);

      expect(result).toEqual(employeeModel);
    });

    it('should throw Error if company does not exist', async () => {
      const employeeData = {
        name: 'Gabriel',
        cpf: '12345678901',
        email: 'gabriel@gmail.com',
        password: 'password',
        salario: 3000,
        empresa: 'credifitt',
      }; 
      jest.spyOn(companyRepository, 'findOne').mockResolvedValueOnce(undefined);

      await expect(repository.createEmployee(employeeData)).rejects.toThrow(
        'Não foi possível criar o funcionário',
      );
    });
  });

  describe('getAllEmployees', () => {
    it('should return all employees', async () => {
      const employees = [new EmployeeModel(), new EmployeeModel()]; 
      jest.spyOn(employeeRepository, 'find').mockResolvedValueOnce(employees);

      const result = await repository.getAllEmployees();

      expect(result).toEqual(employees);
    });
  });

  describe('getEmployeeById', () => {
    it('should return an employee by id', async () => {
      const employee = new EmployeeModel(); 
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employee);

      const result = await repository.getEmployeeById(1);

      expect(result).toEqual(employee);
    });

    it('should throw NotFoundException if employee does not exist', async () => {
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(repository.getEmployeeById(1)).rejects.toThrow(
        'Erro ao buscar funcionário por ID',
      );
    });
  });

  describe('updateEmployee', () => {
    it('should update an employee', async () => {
      const employeeData = {
        name: 'Gabriel',
        cpf: '12345678901',
        email: 'gabriel@gmail.com',
        password: 'password',
        salario: 3000,
        empresa: 'credifit',
      }; 
      const updatedEmployee = {
        id: 1,
        name: 'Gabriel 1',
        cpf: '123456789011',
        email: 'gabriel1@gmail.com',
        password: 'password1',
        salario: 3001,
        empresa: 'credifit1',
      };  
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(new EmployeeModel()); 
      jest.spyOn(employeeRepository, 'update').mockResolvedValueOnce(undefined);
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(updatedEmployee);

      const result = await repository.updateEmployee(1, employeeData);

      expect(result).toEqual(updatedEmployee);
    });

    it('should throw Error if employee does not exist', async () => {
      const employeeData = {
        name: 'Gabriel',
        cpf: '12345678901',
        email: 'gabriel@gmail.com',
        password: 'password',
        salario: 3000,
        empresa: 'credifit',
      };  
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(repository.updateEmployee(1, employeeData)).rejects.toThrow(
        'Erro ao atualizar o funcionário',
      );
    });
  });

  describe('deleteEmployee', () => {
    it('should delete an employee', async () => {
      const employee = new EmployeeModel(); 
      jest.spyOn(employeeRepository, 'findOne').mockResolvedValueOnce(employee); 
      jest.spyOn(employeeRepository, 'delete').mockResolvedValueOnce(undefined);

      await repository.deleteEmployee(1);

      expect(employeeRepository.delete).toHaveBeenCalledWith(1);
    });

    it('should throw Error if employee does not exist', async () => {
      jest
        .spyOn(employeeRepository, 'findOne')
        .mockResolvedValueOnce(undefined);

      await expect(repository.deleteEmployee(1)).rejects.toThrow(
        'Erro ao deletar o funcionário',
      );
    });
  });

  describe('findLoansByEmployeeCpf', () => {
    it('should return loans by employee cpf', async () => {
      const loans = [new LoanModel(), new LoanModel()]; 
      jest.spyOn(loanRepository, 'find').mockResolvedValueOnce(loans);

      const result = await repository.findLoansByEmployeeCpf('12345678901');

      expect(result).toEqual(loans);
    });

    it('should throw Error if no loans are found for the employee cpf', async () => {
      jest.spyOn(loanRepository, 'find').mockResolvedValueOnce([]);

      await expect(
        repository.findLoansByEmployeeCpf('12345678901'),
      ).rejects.toThrow('Erro ao buscar empréstimos vinculados ao CPF');
    });
  });
});
