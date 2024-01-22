import { Controller, Get, Query } from '@nestjs/common';

import { LocationTrafficImageType } from 'src/traffic/types/traffic';
import { QueryDateValidationPipe } from 'src/common/pipes/query-date-validation';
import { LocationsService } from './locations.service';
import { LocationWeatherForecastType } from 'src/weather/types/weather';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('traffic')
  async getLocationsTrafficImages(
    @Query('datetime', QueryDateValidationPipe) datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    return this.locationsService.getTrafficLocations(datetime);
  }

  @Get('weather')
  async getLocationsWeatherForecasts(
    @Query('datetime', QueryDateValidationPipe) datetime: string,
  ): Promise<Array<LocationWeatherForecastType>> {
    return this.locationsService.getWeatherForecasts(datetime);
  }
}
