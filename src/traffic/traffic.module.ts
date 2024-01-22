import { Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { GeolocationService } from 'src/geolocation/geolocation.service';

@Module({
  providers: [TrafficService, GeolocationService],
})
export class TrafficModule {}
