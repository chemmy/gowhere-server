import { Module } from '@nestjs/common';
import { GeolocationService } from './geolocation.service';
import { RedisService } from 'src/common/utils/redis.service';

@Module({
  providers: [GeolocationService, RedisService],
})
export class GeolocationModule {}
