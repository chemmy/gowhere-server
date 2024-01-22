import { Injectable } from '@nestjs/common';
import { TrafficService } from 'src/traffic/traffic.service';
import { LocationTrafficImageType } from 'src/traffic/types/traffic';
import { LocationWeatherForecastType } from 'src/weather/types/weather';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class LocationsService {
  constructor(
    private trafficService: TrafficService,
    private weatherService: WeatherService,
  ) {}

  async getTrafficLocations(
    datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    return await this.trafficService.getTrafficImages(datetime);
  }

  async getWeatherForecasts(
    datetime: string,
  ): Promise<Array<LocationWeatherForecastType>> {
    return await this.weatherService.getWeatherForecastLocations(datetime);
  }
}
