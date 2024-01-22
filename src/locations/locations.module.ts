import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TrafficService } from 'src/traffic/traffic.service';
import { WeatherService } from 'src/weather/weather.service';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { GeolocationService } from 'src/geolocation/geolocation.service';
import { ReportsService } from 'src/reports/reports.service';
import { Log } from 'src/reports/entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [
    LocationsService,
    TrafficService,
    WeatherService,
    GeolocationService,
    ReportsService,
  ],
  controllers: [LocationsController],
})
export class LocationsModule {}
