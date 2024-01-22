import { Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';

@Module({
  providers: [TrafficService],
})
export class TrafficModule {}
