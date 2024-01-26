import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TrafficService } from '../traffic/traffic.service';
import { WeatherService } from '../weather/weather.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { ReportsService } from '../reports/reports.service';
import { Log } from '../reports/entities/log.entity';
import { RedisService } from '../common/utils/redis.service';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [
    LocationsService,
    TrafficService,
    WeatherService,
    GeolocationService,
    ReportsService,
    RedisService,
  ],
  controllers: [LocationsController],
})
export class LocationsModule {}
