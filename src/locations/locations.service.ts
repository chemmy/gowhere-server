import {
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';

import { GeolocationService } from '../geolocation/geolocation.service';
import { ReportsService } from '../reports/reports.service';
import { TrafficService } from '../traffic/traffic.service';
import { LocationTrafficImageType } from '../traffic/types/traffic';
import { LocationWeatherForecastType } from '../weather/types/weather';
import { WeatherService } from '../weather/weather.service';

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
    Logger.log(`Retrieving traffic locations for ${datetime}`);

    try {
      const trafficLocations =
        await this.trafficService.getTrafficImages(datetime);

      const locationNames =
        this.geolocationService.getLocationNamesFromCoordinates(
          trafficLocations,
        );

      Logger.log(`Successfully retrieved traffic locations for ${datetime}`);

      return locationNames;
    } catch (error) {
      const { message } = error;
      Logger.error(`Error in retrieving locations for ${datetime}`, message);
      throw new InternalServerErrorException(message);
    }
  }

  async getWeatherForecast(
    datetime: string,
    latitude: number,
    longitude: number,
    location: string,
  ): Promise<LocationWeatherForecastType> {
    const params = JSON.stringify({ datetime, latitude, longitude, location });
    Logger.log(`Retrieving weather forecast for ${params}`);

    try {
      await this.reportService.create({
        search_location: location,
        search_timestamp: new Date(datetime).setSeconds(0, 0).valueOf(),
      });

      const locationsWeatherForecast =
        await this.weatherService.getWeatherForecastLocations(datetime);

      const nearestLocationWeather =
        this.geolocationService.findNearestCoordinates(
          latitude,
          longitude,
          locationsWeatherForecast,
        );

      if (!nearestLocationWeather)
        throw new NotFoundException('No weather forecast near the area found.');

      Logger.log(`Successfully retrieved weather forecast for ${params}`);

      return nearestLocationWeather as LocationWeatherForecastType;
    } catch (error) {
      const { message } = error;
      if (error instanceof NotFoundException) {
        Logger.error(`No weather forecast found for ${params}`);
        throw new NotFoundException(message);
      }

      Logger.error(`Error retrieving weather forecast for ${params}`, message);
      throw new InternalServerErrorException(message);
    }
  }
}
