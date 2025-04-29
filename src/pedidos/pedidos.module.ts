import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { PedidosController } from "./pedidos.controller";
import { PedidosService } from "./pedidos.service";
import { Pedido, PedidoSchema } from "./schemas/pedido.schema";
import { EstoqueController } from "./estoque.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Pedido.name, schema: PedidoSchema }]),
  ],
  controllers: [PedidosController, EstoqueController],
  providers: [PedidosService],
})
export class PedidosModule {}
