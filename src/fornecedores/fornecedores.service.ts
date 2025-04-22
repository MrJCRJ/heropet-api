// src/fornecedores/fornecedores.service.ts
import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Fornecedor } from "./schemas/fornecedor.schema";
import { CreateFornecedorDto } from "./dto/create-fornecedor.dto";

@Injectable()
export class FornecedoresService {
  private readonly logger = new Logger(FornecedoresService.name);

  constructor(
    @InjectModel(Fornecedor.name) private fornecedorModel: Model<Fornecedor>
  ) {}

  async criar(fornecedorDto: CreateFornecedorDto): Promise<Fornecedor> {
    this.logger.log(`Criando fornecedor com CNPJ: ${fornecedorDto.cnpj}`);
    const criado = new this.fornecedorModel(fornecedorDto);
    return criado.save();
  }

  async buscarTodos(): Promise<Fornecedor[]> {
    this.logger.log("Buscando todos os fornecedores");
    return this.fornecedorModel.find().exec();
  }

  async buscarPorCnpj(cnpj: string): Promise<Fornecedor | null> {
    this.logger.log(`Buscando fornecedor por CNPJ: ${cnpj}`);
    return this.fornecedorModel.findOne({ cnpj }).exec();
  }

  async atualizar(
    cnpj: string,
    fornecedorDto: CreateFornecedorDto
  ): Promise<Fornecedor | null> {
    this.logger.log(`Atualizando fornecedor com CNPJ: ${cnpj}`);
    return this.fornecedorModel
      .findOneAndUpdate({ cnpj }, fornecedorDto, { new: true })
      .exec();
  }

  async remover(cnpj: string): Promise<{ deletedCount: number }> {
    this.logger.log(`Removendo fornecedor com CNPJ: ${cnpj}`);
    return this.fornecedorModel.deleteOne({ cnpj }).exec();
  }
}
