import { Module } from '@nestjs/common';

import { TrafficService } from 'src/traffic/traffic.service';
import { WeatherService } from 'src/weather/weather.service';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';

@Module({
  providers: [LocationsService, TrafficService, WeatherService],
  controllers: [LocationsController],
})
export class LocationsModule {}
