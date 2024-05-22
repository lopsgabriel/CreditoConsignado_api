/* eslint-disable prettier/prettier */
// eslint-disable-next-line prettier/prettier
import { Body, Controller, Get, Param, ParseIntPipe, Post, Delete, Put } from '@nestjs/common';
import { LoanRepository } from '../repositories/loan.repository';
import { LoanModel } from '../model/loan.model';
import { LoanSchema } from '../schemas/loan.schemas';

@Controller('/emprestimo')
export class LoanController {
  constructor(private readonly loanRepository: LoanRepository) {}

  @Post('/request/:id')
  async requestLoan(
    @Param('id', ParseIntPipe) id: number,
    @Body() loanSchema: LoanSchema,
  ) {
    return this.loanRepository.requestLoan(id, loanSchema);
  }

  @Get()
  async getAll(): Promise<LoanModel[]> {
    return this.loanRepository.getAll();
  }

  @Get(':loanId')
  async getOne(
    @Param('loanId', ParseIntPipe) loanId: number,
  ): Promise<LoanModel> {
    return this.loanRepository.getOne(loanId);
  }

  @Put('/request/:loanId')
  async update(
    @Param('loanId', ParseIntPipe) loanId: number,
    @Body() body: LoanSchema,
  ): Promise<LoanModel> {
    return this.loanRepository.update(loanId, body);
  }

  @Delete(':loanId')
  async delete(@Param('loanId', ParseIntPipe) loanId: number): Promise<string> {
    return this.loanRepository.delete(loanId);
  }
}
