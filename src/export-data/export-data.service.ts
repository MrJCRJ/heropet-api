import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Fornecedor } from "../fornecedores/schemas/fornecedor.schema";
import { Pedido } from "../pedidos/schemas/pedido.schema";
import { Cliente } from "../clientes/schemas/cliente.schema";

@Injectable()
export class ExportDataService {
  constructor(
    @InjectModel("Fornecedor") private fornecedorModel: Model<Fornecedor>,
    @InjectModel("Pedido") private pedidoModel: Model<Pedido>,
    @InjectModel("Cliente") private clienteModel: Model<Cliente>
  ) {}

  async exportAllData() {
    const fornecedores = await this.fornecedorModel.find().exec();
    const pedidos = await this.pedidoModel.find().exec();
    const clientes = await this.clienteModel.find().exec();

    return {
      fornecedores,
      pedidos,
      clientes,
      exportDate: new Date().toISOString(),
    };
  }
}
