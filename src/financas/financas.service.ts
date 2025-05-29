import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Financa, FinancaDocument } from "./schemas/financa.schema";
import { CreateFinancaDto } from "./dto/create-financa.dto";

@Injectable()
export class FinancasService {
  constructor(
    @InjectModel(Financa.name) private financaModel: Model<FinancaDocument>
  ) {}

  async create(createFinancaDto: CreateFinancaDto): Promise<Financa> {
    const createdFinanca = new this.financaModel({
      ...createFinancaDto,
      data: new Date(createFinancaDto.data), // Garante que é Date
    });
    return createdFinanca.save();
  }

  async createBulk(createFinancasDto: CreateFinancaDto[]): Promise<Financa[]> {
    const financasToCreate = createFinancasDto.map((dto) => ({
      ...dto,
      data: new Date(dto.data), // Converte cada data
    }));
    return this.financaModel.insertMany(financasToCreate);
  }

  async findAll(): Promise<Financa[]> {
    return this.financaModel.find().exec();
  }
}
