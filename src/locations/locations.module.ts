import { Module } from '@nestjs/common';
import { LocationsService } from './locations.service';
import { LocationsController } from './locations.controller';
import { TrafficService } from 'src/traffic/traffic.service';

@Module({
  providers: [LocationsService, TrafficService],
  controllers: [LocationsController],
})
export class LocationsModule {}
