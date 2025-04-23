import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
} from "@nestjs/common";
import { FornecedoresService } from "./fornecedores.service";
import { CreateFornecedorDto } from "./dto/create-fornecedor.dto";
import { Fornecedor } from "./schemas/fornecedor.schema";

@Controller("fornecedores")
export class FornecedoresController {
  constructor(private readonly fornecedoresService: FornecedoresService) {}

  @Post()
  async criar(
    @Body() createFornecedorDto: CreateFornecedorDto
  ): Promise<Fornecedor> {
    return this.fornecedoresService.criar(createFornecedorDto);
  }

  @Get()
  async buscarTodos(): Promise<Fornecedor[]> {
    return this.fornecedoresService.buscarTodos();
  }

  @Get(":cnpj")
  async buscarPorCnpj(@Param("cnpj") cnpj: string): Promise<Fornecedor> {
    const fornecedor = await this.fornecedoresService.buscarPorCnpj(cnpj);
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
    }
    return fornecedor;
  }

  @Put(":cnpj")
  async atualizar(
    @Param("cnpj") cnpj: string,
    @Body() updateFornecedorDto: Partial<CreateFornecedorDto>
  ): Promise<Fornecedor> {
    const fornecedor = await this.fornecedoresService.atualizar(
      cnpj,
      updateFornecedorDto
    );
    if (!fornecedor) {
      throw new NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
    }
    return fornecedor;
  }

  @Delete(":cnpj")
  async remover(@Param("cnpj") cnpj: string): Promise<void> {
    const result = await this.fornecedoresService.remover(cnpj);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
    }
  }
}
