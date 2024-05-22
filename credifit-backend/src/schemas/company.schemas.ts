/* eslint-disable prettier/prettier */

import { IsDefined, IsString, IsNotEmpty, IsEmail } from 'class-validator';




export class CompanySchema {
 
  
  @IsDefined()
  @IsNotEmpty()
  @IsString()
  cpf: string;

  @IsDefined()
  @IsNotEmpty()
  @IsString()
  cnpj: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsString()
  razaosocial: string;
}
