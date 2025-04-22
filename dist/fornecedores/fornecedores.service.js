"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var FornecedoresService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.FornecedoresService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const fornecedor_schema_1 = require("./schemas/fornecedor.schema");
let FornecedoresService = FornecedoresService_1 = class FornecedoresService {
    constructor(fornecedorModel) {
        this.fornecedorModel = fornecedorModel;
        this.logger = new common_1.Logger(FornecedoresService_1.name);
    }
    async criar(fornecedorDto) {
        this.logger.log(`Criando fornecedor com CNPJ: ${fornecedorDto.cnpj}`);
        const criado = new this.fornecedorModel(fornecedorDto);
        return criado.save();
    }
    async buscarTodos() {
        this.logger.log("Buscando todos os fornecedores");
        return this.fornecedorModel.find().exec();
    }
    async buscarPorCnpj(cnpj) {
        this.logger.log(`Buscando fornecedor por CNPJ: ${cnpj}`);
        return this.fornecedorModel.findOne({ cnpj }).exec();
    }
    async atualizar(cnpj, fornecedorDto) {
        this.logger.log(`Atualizando fornecedor com CNPJ: ${cnpj}`);
        return this.fornecedorModel
            .findOneAndUpdate({ cnpj }, fornecedorDto, { new: true })
            .exec();
    }
    async remover(cnpj) {
        this.logger.log(`Removendo fornecedor com CNPJ: ${cnpj}`);
        return this.fornecedorModel.deleteOne({ cnpj }).exec();
    }
};
exports.FornecedoresService = FornecedoresService;
exports.FornecedoresService = FornecedoresService = FornecedoresService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(fornecedor_schema_1.Fornecedor.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], FornecedoresService);
//# sourceMappingURL=fornecedores.service.js.map