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
Object.defineProperty(exports, "__esModule", { value: true });
exports.FornecedoresController = void 0;
const common_1 = require("@nestjs/common");
const fornecedores_service_1 = require("./fornecedores.service");
const create_fornecedor_dto_1 = require("./dto/create-fornecedor.dto");
let FornecedoresController = class FornecedoresController {
    constructor(fornecedoresService) {
        this.fornecedoresService = fornecedoresService;
    }
    async criar(createFornecedorDto) {
        return this.fornecedoresService.criar(createFornecedorDto);
    }
    async buscarTodos() {
        return this.fornecedoresService.buscarTodos();
    }
    async buscarPorCnpj(cnpj) {
        const fornecedor = await this.fornecedoresService.buscarPorCnpj(cnpj);
        if (!fornecedor) {
            throw new common_1.NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
        }
        return fornecedor;
    }
    async atualizar(cnpj, updateFornecedorDto) {
        const fornecedor = await this.fornecedoresService.atualizar(cnpj, updateFornecedorDto);
        if (!fornecedor) {
            throw new common_1.NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
        }
        return fornecedor;
    }
    async remover(cnpj) {
        const result = await this.fornecedoresService.remover(cnpj);
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException(`Fornecedor com CNPJ ${cnpj} não encontrado`);
        }
    }
};
exports.FornecedoresController = FornecedoresController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_fornecedor_dto_1.CreateFornecedorDto]),
    __metadata("design:returntype", Promise)
], FornecedoresController.prototype, "criar", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], FornecedoresController.prototype, "buscarTodos", null);
__decorate([
    (0, common_1.Get)(":cnpj"),
    __param(0, (0, common_1.Param)("cnpj")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FornecedoresController.prototype, "buscarPorCnpj", null);
__decorate([
    (0, common_1.Put)(":cnpj"),
    __param(0, (0, common_1.Param)("cnpj")),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], FornecedoresController.prototype, "atualizar", null);
__decorate([
    (0, common_1.Delete)(":cnpj"),
    __param(0, (0, common_1.Param)("cnpj")),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], FornecedoresController.prototype, "remover", null);
exports.FornecedoresController = FornecedoresController = __decorate([
    (0, common_1.Controller)("fornecedores"),
    __metadata("design:paramtypes", [fornecedores_service_1.FornecedoresService])
], FornecedoresController);
//# sourceMappingURL=fornecedores.controller.js.map