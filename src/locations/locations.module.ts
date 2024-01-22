import { Module } from '@nestjs/common';

import { TrafficService } from 'src/traffic/traffic.service';
import { WeatherService } from 'src/weather/weather.service';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { GeolocationService } from 'src/geolocation/geolocation.service';

@Module({
  providers: [
    LocationsService,
    TrafficService,
    WeatherService,
    GeolocationService,
  ],
  controllers: [LocationsController],
})
export class LocationsModule {}
