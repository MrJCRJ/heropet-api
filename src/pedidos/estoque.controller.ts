import { Controller, Get } from "@nestjs/common";
import { PedidosService } from "./pedidos.service";
import { ProdutoHistoricoResponse } from "./interface";

@Controller("estoque")
export class EstoqueController {
  constructor(private readonly pedidosService: PedidosService) {}

  @Get("historico")
  async getHistoricoEstoque(): Promise<ProdutoHistoricoResponse[]> {
    return this.pedidosService.calcularHistoricoEstoque();
  }
}
