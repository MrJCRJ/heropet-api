import { Module } from "@nestjs/common";
import { ExportDataService } from "./export-data.service";
import { ExportDataController } from "./export-data.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { FornecedorSchema } from "../fornecedores/schemas/fornecedor.schema";
import { PedidoSchema } from "../pedidos/schemas/pedido.schema";
import { ClienteSchema } from "../clientes/schemas/cliente.schema";

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: "Fornecedor", schema: FornecedorSchema },
    ]),
    MongooseModule.forFeature([{ name: "Pedido", schema: PedidoSchema }]),
    MongooseModule.forFeature([{ name: "Cliente", schema: ClienteSchema }]),
  ],
  providers: [ExportDataService],
  controllers: [ExportDataController],
})
export class ExportDataModule {}
