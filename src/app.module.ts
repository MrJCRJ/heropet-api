// src/app.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { HttpModule } from "@nestjs/axios";
import { FornecedoresModule } from "./fornecedores/fornecedores.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { PedidosModule } from "./pedidos/pedidos.module";
import { ClientesModule } from "./clientes/clientes.module";
import { FinancasModule } from "./financas/financas.module";

@Module({
  imports: [
    ConfigModule.forRoot(), // Carrega as variáveis de ambiente
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>("MONGODB_URI"),
      }),
      inject: [ConfigService],
    }),
    HttpModule,
    FornecedoresModule,
    PedidosModule,
    ClientesModule,
    FinancasModule,
  ],
})
export class AppModule {}
