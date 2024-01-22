import { Controller, Get, Query } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationTrafficImageType } from 'src/traffic/types/traffic';

@Controller('locations')
export class LocationsController {
  constructor(private locationsService: LocationsService) {}

  @Get('traffic')
  async getLocationsTrafficImages(
    @Query('datetime') datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    return this.locationsService.getTrafficLocations(datetime);
  }
}
