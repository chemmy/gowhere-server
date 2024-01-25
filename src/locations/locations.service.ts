import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { GeolocationService } from 'src/geolocation/geolocation.service';
import { ReportsService } from 'src/reports/reports.service';
import { TrafficService } from 'src/traffic/traffic.service';
import { LocationTrafficImageType } from 'src/traffic/types/traffic';
import { LocationWeatherForecastType } from 'src/weather/types/weather';
import { WeatherService } from 'src/weather/weather.service';

@Injectable()
export class LocationsService {
  constructor(
    private trafficService: TrafficService,
    private weatherService: WeatherService,
    private geolocationService: GeolocationService,
    private reportService: ReportsService,
  ) {}

  async getTrafficLocations(
    datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    try {
      const trafficLocations =
        await this.trafficService.getTrafficImages(datetime);

      const locationNames =
        this.geolocationService.getLocationNamesFromCoordinates(
          trafficLocations,
        );

      return locationNames;
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getWeatherForecast(
    datetime: string,
    latitude: number,
    longitude: number,
    location: string,
  ): Promise<LocationWeatherForecastType> {
    try {
      await this.reportService.create({
        search_location: location,
        search_timestamp: new Date(datetime).setSeconds(0, 0).valueOf(),
      });
      const locationsWeatherForecast =
        await this.weatherService.getWeatherForecastLocations(datetime);

      // TODO: handle no results

      const nearestLocationWeather =
        this.geolocationService.findNearestCoordinates(
          latitude,
          longitude,
          locationsWeatherForecast,
        );

      if (!nearestLocationWeather)
        throw new NotFoundException('No weather forecast near the area found.');

      return nearestLocationWeather as LocationWeatherForecastType;
    } catch (error) {
      if (error instanceof NotFoundException)
        throw new NotFoundException(error.message);

      throw new InternalServerErrorException(error.message);
    }
  }
}
