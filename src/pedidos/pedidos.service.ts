import { Injectable, Logger, BadRequestException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Pedido } from "./schemas/pedido.schema";
import { CreatePedidoDto } from "./dto/create-pedido.dto";
import { HistoricoEstoque, ProdutoHistoricoResponse } from "./interface";

@Injectable()
export class PedidosService {
  private readonly logger = new Logger(PedidosService.name);

  constructor(@InjectModel(Pedido.name) private pedidoModel: Model<Pedido>) {}

  async criar(createPedidoDto: CreatePedidoDto): Promise<Pedido> {
    try {
      const criado = new this.pedidoModel(createPedidoDto);
      return await criado.save();
    } catch (error: any) {
      this.logger.error(`Erro ao criar pedido: ${error.message}`);
      throw new BadRequestException("Dados do pedido inválidos");
    }
  }

  async buscarTodos(): Promise<Pedido[]> {
    return this.pedidoModel.find().exec();
  }

  async buscarComFiltros(filtros: {
    tipo?: string;
    status?: string;
    ordenacao?: string;
  }): Promise<Pedido[]> {
    const query: any = {};

    if (filtros.tipo && filtros.tipo !== "TODOS") {
      query.tipo = filtros.tipo;
    }

    if (filtros.status) {
      query.status = filtros.status;
    }

    let consulta = this.pedidoModel.find(query);

    if (filtros.ordenacao) {
      const sortOrder = filtros.ordenacao === "data_asc" ? 1 : -1;
      consulta = consulta.sort({ dataPedido: sortOrder });
    }

    return consulta.exec();
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
    try {
      const pedidos = await this.pedidoModel
        .find()
        .sort({ dataPedido: 1 })
        .exec();

      const historico: HistoricoEstoque = {};

      for (const pedido of pedidos) {
        for (const item of pedido.itens) {
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
            const novoEstoque = produto.estoqueAtual - item.quantidade;
            produto.estoqueAtual = Math.max(0, novoEstoque);
            mesHistorico.vendas += item.quantidade;
          }

          mesHistorico.estoque = produto.estoqueAtual;
        }
      }

      return Object.keys(historico).map((produtoId) => ({
        produtoId,
        nome: historico[produtoId].nome,
        estoqueAtual: historico[produtoId].estoqueAtual,
        historicoMensal: Object.values(historico[produtoId].historicoMensal),
      }));
    } catch (error: any) {
      this.logger.error(`Erro ao calcular histórico: ${error.message}`);
      throw new Error("Falha ao calcular histórico de estoque");
    }
  }

  async parcelarPedido(
    pedidoId: string,
    quantidadeParcelas: number,
    semanal: boolean
  ): Promise<Pedido | null> {
    const pedido = await this.pedidoModel.findById(pedidoId).exec();
    if (!pedido) {
      return null;
    }

    // Verificar se já foi parcelado
    if (pedido.parcelado) {
      throw new Error("Este pedido já foi parcelado");
    }

    // Calcular parcelas
    const parcelas = this.calcularParcelas(
      pedido.dataPedido,
      pedido.totalPedido,
      quantidadeParcelas,
      semanal
    );

    // Atualizar pedido com as parcelas
    return this.pedidoModel
      .findByIdAndUpdate(
        pedidoId,
        {
          parcelado: true,
          quantidadeParcelas,
          parcelamentoSemanal: semanal,
          parcelas,
        },
        { new: true }
      )
      .exec();
  }

  private calcularParcelas(
    dataPedido: Date,
    totalPedido: number,
    quantidadeParcelas: number,
    semanal: boolean
  ): Array<{
    numero: number;
    dataVencimento: Date;
    valor: number;
    pago: boolean;
  }> {
    const valorParcela = totalPedido / quantidadeParcelas;
    const parcelas = [];

    for (let i = 1; i <= quantidadeParcelas; i++) {
      const dataVencimento = new Date(dataPedido);

      if (semanal) {
        // Parcelamento semanal: 7, 14, 21, 28 dias
        dataVencimento.setDate(dataPedido.getDate() + i * 7);
      } else {
        // Parcelamento mensal (30 dias)
        dataVencimento.setDate(dataPedido.getDate() + i * 30);
      }

      parcelas.push({
        numero: i,
        dataVencimento,
        valor: valorParcela,
        pago: false,
      });
    }

    return parcelas;
  }

  async marcarParcelaComoPaga(
    pedidoId: string,
    numeroParcela: number
  ): Promise<Pedido | null> {
    return this.pedidoModel
      .findOneAndUpdate(
        {
          _id: pedidoId,
          "parcelas.numero": numeroParcela,
        },
        {
          $set: { "parcelas.$.pago": true },
        },
        { new: true }
      )
      .exec();
  }
}
