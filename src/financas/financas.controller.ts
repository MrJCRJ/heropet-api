import { Body, Controller, Get, Post } from "@nestjs/common";
import { FinancasService } from "./financas.service";
import { CreateFinancaDto } from "./dto/create-financa.dto";
import { Financa } from "./schemas/financa.schema";

@Controller("financas")
export class FinancasController {
  constructor(private readonly financasService: FinancasService) {}

  @Post()
  create(@Body() createFinancaDto: CreateFinancaDto): Promise<Financa> {
    return this.financasService.create(createFinancaDto);
  }

  @Post("bulk")
  createBulk(
    @Body() createFinancasDto: CreateFinancaDto[]
  ): Promise<Financa[]> {
    return this.financasService.createBulk(createFinancasDto);
  }

  @Get()
  findAll(): Promise<Financa[]> {
    return this.financasService.findAll();
  }
}
