import { Injectable } from '@nestjs/common';
import { TrafficService } from 'src/traffic/traffic.service';
import { LocationTrafficImageType } from 'src/traffic/types/traffic';

@Injectable()
export class LocationsService {
  constructor(private trafficService: TrafficService) {}

  async getTrafficLocations(
    datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    return await this.trafficService.getTrafficImages(datetime);
  }
}
