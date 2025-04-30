// File: src/clientes/clientes.controller.ts
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  UsePipes,
  ValidationPipe,
} from "@nestjs/common";
import { ClientesService } from "./clientes.service";
import { CreateClienteDto } from "./dto/create-cliente.dto";
import { NotFoundException } from "@nestjs/common/exceptions";
import { UpdateClienteDto } from "./dto/update-cliente.dto";

@Controller("clientes")
export class ClientesController {
  constructor(private readonly clientesService: ClientesService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  async create(@Body() createClienteDto: CreateClienteDto) {
    console.log("DTO recebido no controller:", createClienteDto);
    return this.clientesService.create(createClienteDto);
  }

  @Get()
  findAll() {
    return this.clientesService.findAll();
  }

  @Get(":cpfOuCnpj")
  async findOne(@Param("cpfOuCnpj") cpfOuCnpj: string) {
    const cliente = await this.clientesService.findOne(cpfOuCnpj);
    if (!cliente) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return cliente;
  }

  @Put(":cpfOuCnpj")
  @UsePipes(new ValidationPipe({ transform: true }))
  async update(
    @Param("cpfOuCnpj") cpfOuCnpj: string,
    @Body() updateClienteDto: UpdateClienteDto
  ) {
    console.log("Requisição de atualização recebida:", {
      cpfOuCnpj,
      updateClienteDto,
    });
    const updated = await this.clientesService.update(
      cpfOuCnpj,
      updateClienteDto
    );
    console.log("Resposta da atualização:", updated);
    return updated;
  }

  @Delete(":cpfOuCnpj")
  async remove(@Param("cpfOuCnpj") cpfOuCnpj: string) {
    const cliente = await this.clientesService.remove(cpfOuCnpj);
    if (!cliente) {
      throw new NotFoundException("Cliente não encontrado");
    }
    return cliente;
  }
}
