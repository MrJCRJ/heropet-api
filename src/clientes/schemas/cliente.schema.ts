// File: src/clientes/schemas/cliente.schema.ts
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

export type ClienteDocument = Cliente & Document;

// File: src/clientes/schemas/cliente.schema.ts
@Schema()
export class Cliente {
  @Prop({ required: true, unique: true })
  cpfOuCnpj!: string;

  @Prop()
  nome?: string;

  @Prop()
  telefone?: string;

  @Prop()
  cep?: string;

  @Prop()
  numero?: string;

  @Prop()
  complemento?: string;

  @Prop({ default: Date.now })
  createdAt?: Date;

  @Prop({ default: Date.now })
  updatedAt?: Date;
}

export const ClienteSchema = SchemaFactory.createForClass(Cliente);
