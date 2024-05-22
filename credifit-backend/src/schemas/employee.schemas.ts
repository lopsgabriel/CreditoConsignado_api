/* eslint-disable prettier/prettier */
import { Transform } from 'class-transformer';
import { IsDefined, IsString, IsNotEmpty, IsEmail, IsNumber, Min } from 'class-validator';




export class EmployeeSchema {
 
  
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsString()
  @IsNotEmpty()
  empresa: string;

  @IsNotEmpty()
  @IsNumber()
  @Min(0)
  @Transform(value => parseFloat(value.toString()))
  salario: number;

}
