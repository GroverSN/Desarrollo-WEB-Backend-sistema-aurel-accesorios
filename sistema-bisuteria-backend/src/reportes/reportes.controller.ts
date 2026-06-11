import { Controller, Get, Query, UseGuards, Res } from '@nestjs/common';
import type { Response } from 'express';
import { ReportesService } from './reportes.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('reportes')
@UseGuards(JwtAuthGuard)
export class ReportesController {
  constructor(private readonly reportesService: ReportesService) {}

  @Get('pdf')
  async generatePDF(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
    @Res() res: Response,
    @Query('cliente') cliente?: string,
  ) {
    const start = new Date(startDate);
    const end = new Date(endDate);

    const pdfBuffer = await this.reportesService.generatePDFReport(start, end, cliente);

    const suffix = cliente ? `-${cliente}` : '';
    res.set({
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="reporte-ventas-${startDate}-${endDate}${suffix}.pdf"`,
      'Content-Length': pdfBuffer.length,
    });

    res.end(pdfBuffer);
  }

  @Get('stats/monthly')
  getMonthlyStats(@Query('year') year: string) {
    return this.reportesService.getMonthlyStats(+year);
  }

  @Get('stats/top-products')
  getTopProducts(@Query('limit') limit?: string) {
    return this.reportesService.getTopProducts(limit ? +limit : 10);
  }

  @Get('stats/resumen')
  getResumenGeneral() {
    return this.reportesService.getResumenGeneral();
  }
}