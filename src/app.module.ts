import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficModule } from './traffic/traffic.module';
import { LocationsModule } from './locations/locations.module';

@Module({
  imports: [TrafficModule, LocationsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
