import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Pedido } from "./schemas/pedido.schema";
import { CreatePedidoDto } from "./dto/create-pedido.dto";

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(@InjectModel(Pedido.name) private pedidoModel: Model<Pedido>) {}

  async criar(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    const criado = new this.pedidoModel(createPedidoDto);
    return criado.save();
  }

  async buscarTodos(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async buscarPorId(id: string): Promise<Pedido | null> {
    return this.pedidoModel.findById(id).exec();
  }

  async atualizar(
    id: string,
    updatePedidoDto: Partial<CreatePedidoDto>
  ): Promise<Pedido | null> {
    return this.pedidoModel
      .findByIdAndUpdate(id, updatePedidoDto, { new: true })
      .exec();
  }

  async remover(id: string): Promise<{ deletedCount: number }> {
    return this.pedidoModel.deleteOne({ _id: id }).exec();
  }

  async buscarPorTipo(tipo: string): Promise<Pedido[]> {
    return this.pedidoModel.find({ tipo }).exec();
  }
}
