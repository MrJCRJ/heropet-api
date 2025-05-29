import { Controller, Get, Res } from "@nestjs/common";
import { ExportDataService } from "./export-data.service";
import { Response } from "express";

@Controller("export-data")
export class ExportDataController {
  constructor(private readonly exportDataService: ExportDataService) {}

  @Get()
  async exportAllData(@Res() res: Response) {
    const data = await this.exportDataService.exportAllData();
    const filename = `dados-exportados-${new Date().toISOString()}.json`;

    // Configura o cabeçalho para download
    res.set({
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="${filename}"`,
    });

    // Envia os dados como JSON
    res.send(data);
  }
}
