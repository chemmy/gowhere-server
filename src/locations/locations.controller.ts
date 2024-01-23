import { Controller, Get, Query } from '@nestjs/common';

import { LocationTrafficImageType } from 'src/traffic/types/traffic';
import { QueryDateValidationPipe } from 'src/common/pipes/query-date-validation';
import { LocationsService } from './locations.service';
import { LocationWeatherForecastType } from 'src/weather/types/weather';
import { QueryNumberValidationPipe } from 'src/common/pipes/query-number-validation';
import { QueryRequiredStringValidationPipe } from 'src/common/pipes/query-required-string-validation';

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
  async getLocationsWeatherForecast(
    @Query('datetime', QueryDateValidationPipe) datetime: string,
    @Query('latitude', QueryNumberValidationPipe) latitude: number,
    @Query('longitude', QueryNumberValidationPipe) longitude: number,
    @Query('location', QueryRequiredStringValidationPipe) location: string,
  ): Promise<LocationWeatherForecastType> {
    return this.locationsService.getWeatherForecast(
      datetime,
      latitude,
      longitude,
      location,
    );
  }
}
