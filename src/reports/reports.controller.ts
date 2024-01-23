import { Controller, Get, Query } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { Log } from './entities/log.entity';
import { QueryNumberValidationPipe } from 'src/common/pipes/query-number-validation';
import {
  MostSearchesPeriodResponseType,
  TopSearchResponseType,
} from './types/report-response';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get('recent-searches')
  async getRecentSearches(): Promise<Array<Log>> {
    return this.reportService.getRecentSearches();
  }

  @Get('top-searches')
  async getTopSearches(
    @Query('start_datetime', QueryNumberValidationPipe) start: number,
    @Query('end_datetime', QueryNumberValidationPipe) end: number,
  ): Promise<Array<TopSearchResponseType>> {
    return this.reportService.getTopSearches(start, end);
  }

  @Get('most-searches-period')
  async getMostSearchedPeriod(
    @Query('start_datetime', QueryNumberValidationPipe) start: number,
    @Query('end_datetime', QueryNumberValidationPipe) end: number,
  ): Promise<MostSearchesPeriodResponseType> {
    return this.reportService.getMostSearchesPeriod(start, end);
  }
}
