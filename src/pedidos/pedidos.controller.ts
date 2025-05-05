import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  NotFoundException,
  Query,
  Patch,
} from "@nestjs/common";
import { PedidosService } from "./pedidos.service";
import { CreatePedidoDto } from "./dto/create-pedido.dto";
import { CriarParcelamentoDto } from "./dto/create-pedido.dto";

@Controller("pedidos")
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}
  @Post()
  async criar(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.criar(createPedidoDto);
  }

  @Get()
  async buscarTodos(
    @Query("tipo") tipo?: string,
    @Query("status") status?: string,
    @Query("ordenacao") ordenacao?: string
  ) {
    // Adicione logs para debug
    console.log("Filtros recebidos:", { tipo, status, ordenacao });

    const pedidos = await this.pedidosService.buscarComFiltros({
      tipo,
      status,
      ordenacao,
    });

    console.log("Pedidos retornados:", pedidos.length);
    return pedidos;
  }

  @Get(":id")
  async buscarPorId(@Param("id") id: string) {
    const pedido = await this.pedidosService.buscarPorId(id);
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  @Put(":id")
  async atualizar(
    @Param("id") id: string,
    @Body() updatePedidoDto: Partial<CreatePedidoDto>
  ) {
    const pedido = await this.pedidosService.atualizar(id, updatePedidoDto);
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  @Delete(":id")
  async remover(@Param("id") id: string) {
    const result = await this.pedidosService.remover(id);
    if (result.deletedCount === 0) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return { message: "Pedido removido com sucesso" };
  }

  @Post(":id/parcelar")
  async parcelarPedido(
    @Param("id") id: string,
    @Body() criarParcelamentoDto: CriarParcelamentoDto
  ) {
    const pedido = await this.pedidosService.parcelarPedido(
      id,
      criarParcelamentoDto.quantidadeParcelas,
      criarParcelamentoDto.semanal
    );
    if (!pedido) {
      throw new NotFoundException(`Pedido com ID ${id} não encontrado`);
    }
    return pedido;
  }

  @Patch(":id/parcelas/:numeroParcela/pagar")
  async marcarParcelaComoPaga(
    @Param("id") id: string,
    @Param("numeroParcela") numeroParcela: number
  ) {
    const pedido = await this.pedidosService.marcarParcelaComoPaga(
      id,
      numeroParcela
    );
    if (!pedido) {
      throw new NotFoundException(
        `Pedido com ID ${id} não encontrado ou parcela inválida`
      );
    }
    return pedido;
  }
}
