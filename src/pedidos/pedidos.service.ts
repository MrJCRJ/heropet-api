import { Injectable, Logger } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Pedido } from "./schemas/pedido.schema";
import { CreatePedidoDto } from "./dto/create-pedido.dto";

export interface HistoricoMensal {
  mes: number;
  ano: number;
  compras: number;
  vendas: number;
  estoque: number;
}

export interface ProdutoHistoricoResponse {
  produtoId: string;
  nome: string;
  estoqueAtual: number;
  historicoMensal: HistoricoMensal[];
}

// Esta interface pode permanecer não exportada pois é usada apenas internamente
interface ProdutoHistorico {
  nome: string;
  estoqueAtual: number;
  historicoMensal: Record<string, HistoricoMensal>;
}

interface HistoricoEstoque {
  [produtoId: string]: ProdutoHistorico;
}

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

  async calcularHistoricoEstoque(): Promise<ProdutoHistoricoResponse[]> {
    const pedidos = await this.pedidoModel
      .find()
      .sort({ dataPedido: 1 })
      .exec();
    const historico: HistoricoEstoque = {};

    pedidos.forEach((pedido) => {
      pedido.itens.forEach((item) => {
        if (!historico[item.produto]) {
          historico[item.produto] = {
            nome: item.produto,
            estoqueAtual: 0,
            historicoMensal: {},
          };
        }

        const produto = historico[item.produto];
        const data = new Date(pedido.dataPedido);
        const mes = data.getMonth() + 1;
        const ano = data.getFullYear();
        const chaveMes = `${ano}-${mes}`;

        if (!produto.historicoMensal[chaveMes]) {
          produto.historicoMensal[chaveMes] = {
            mes,
            ano,
            compras: 0,
            vendas: 0,
            estoque: 0,
          };
        }

        const mesHistorico = produto.historicoMensal[chaveMes];

        if (pedido.tipo === "COMPRA") {
          mesHistorico.compras += item.quantidade;
          produto.estoqueAtual += item.quantidade;
        } else {
          mesHistorico.vendas += item.quantidade;
          produto.estoqueAtual = Math.max(
            0,
            produto.estoqueAtual - item.quantidade
          );
        }

        mesHistorico.estoque = produto.estoqueAtual;
      });
    });

    // Converter para array de resposta
    return Object.keys(historico).map((produtoId) => ({
      produtoId,
      nome: historico[produtoId].nome,
      estoqueAtual: historico[produtoId].estoqueAtual,
      historicoMensal: Object.values(historico[produtoId].historicoMensal),
    }));
  }
}
