import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TrafficModule } from './traffic/traffic.module';
import { LocationsModule } from './locations/locations.module';
import { WeatherModule } from './weather/weather.module';
import { GeolocationModule } from './geolocation/geolocation.module';

@Module({
  imports: [TrafficModule, LocationsModule, WeatherModule, GeolocationModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
