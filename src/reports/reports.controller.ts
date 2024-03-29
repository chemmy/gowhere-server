import { Controller, Get, Query } from '@nestjs/common';

import { ReportsService } from './reports.service';
import { Log } from './entities/log.entity';
import {
  MostSearchesPeriodResponseType,
  TopSearchResponseType,
} from './types/report-response';
import { QueryNumberValidationPipe } from '../common/pipes/query-number-validation';

@Controller('reports')
export class ReportsController {
  constructor(private reportService: ReportsService) {}

  @Get('recent-searches')
  async getRecentSearches(): Promise<Array<Log>> {
    return this.reportService.getRecentSearches();
  }

  @Get('recent-location-searches')
  async getRecentLocationSearches(): Promise<Array<Log>> {
    return this.reportService.getRecentLocationSearches();
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
