import { Module } from '@nestjs/common';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficModule } from './traffic/traffic.module';
import { LocationsModule } from './locations/locations.module';
import { WeatherModule } from './weather/weather.module';
import { GeolocationModule } from './geolocation/geolocation.module';
import { ReportsModule } from './reports/reports.module';
import { RedisService } from './common/utils/redis.service';

import { dbConfig } from './config';

@Module({
  imports: [
    TypeOrmModule.forRoot(dbConfig as TypeOrmModuleOptions),
    TrafficModule,
    LocationsModule,
    WeatherModule,
    GeolocationModule,
    ReportsModule,
  ],
  controllers: [AppController],
  providers: [AppService, RedisService],
  exports: [RedisService],
})
export class AppModule {}
