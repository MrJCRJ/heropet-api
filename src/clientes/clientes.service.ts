// File: src/clientes/clientes.service.ts
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Cliente, ClienteDocument } from "./schemas/cliente.schema";
import { CreateClienteDto } from "./dto/create-cliente.dto";
import { UpdateClienteDto } from "./dto/update-cliente.dto";
import { NotFoundException } from "@nestjs/common/exceptions";

@Injectable()
export class ClientesService {
  constructor(
    @InjectModel(Cliente.name) private clienteModel: Model<Cliente>
  ) {}

  async create(createClienteDto: CreateClienteDto): Promise<Cliente> {
    console.log("Dados recebidos no service:", createClienteDto);
    try {
      const createdCliente = new this.clienteModel(createClienteDto);
      const saved = await createdCliente.save();
      console.log("Cliente salvo no banco:", saved);
      return saved;
    } catch (error) {
      console.error("Erro detalhado ao salvar cliente:", error);
      throw error;
    }
  }

  async findAll(): Promise<Cliente[]> {
    return this.clienteModel.find().exec();
  }

  async findOne(cpfOuCnpj: string): Promise<Cliente | null> {
    return this.clienteModel.findOne({ cpfOuCnpj }).exec();
  }

  async update(
    cpfOuCnpj: string,
    updateClienteDto: UpdateClienteDto
  ): Promise<Cliente | null> {
    console.log("Dados recebidos para atualização:", {
      cpfOuCnpj,
      updateClienteDto,
    });

    const updated = await this.clienteModel
      .findOneAndUpdate(
        { cpfOuCnpj },
        { $set: updateClienteDto },
        { new: true, runValidators: true }
      )
      .exec();

    console.log("Dados retornados após atualização:", updated);

    if (!updated) {
      throw new NotFoundException(
        `Cliente com CPF/CNPJ ${cpfOuCnpj} não encontrado`
      );
    }

    return updated;
  }

  async remove(cpfOuCnpj: string): Promise<Cliente | null> {
    return this.clienteModel.findOneAndDelete({ cpfOuCnpj }).exec();
  }
}
