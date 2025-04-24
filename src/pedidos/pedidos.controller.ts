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
} from "@nestjs/common";
import { PedidosService } from "./pedidos.service";
import { CreatePedidoDto } from "./dto/create-pedido.dto";

@Controller("pedidos")
export class PedidosController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Post()
  async criar(@Body() createPedidoDto: CreatePedidoDto) {
    return this.pedidosService.criar(createPedidoDto);
  }

  @Get()
  async buscarTodos(@Query("tipo") tipo?: string) {
    if (tipo) {
      return this.pedidosService.buscarPorTipo(tipo);
    }
    return this.pedidosService.buscarTodos();
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
}
