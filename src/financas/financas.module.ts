// src/financas/financas.module.ts
import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Financa, FinancaSchema } from "./schemas/financa.schema";
import { FinancasService } from "./financas.service";
import { FinancasController } from "./financas.controller";

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Financa.name, schema: FinancaSchema }]),
  ],
  controllers: [FinancasController],
  providers: [FinancasService],
  exports: [FinancasService], // Exporte se outros módulos precisarem usar
})
export class FinancasModule {}
