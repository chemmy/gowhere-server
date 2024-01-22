import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { GeolocationService } from 'src/geolocation/geolocation.service';
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
  ) {}

  async getTrafficLocations(
    datetime: string,
  ): Promise<Array<LocationTrafficImageType>> {
    try {
      const trafficLocations =
        await this.trafficService.getTrafficImages(datetime);

      // TODO: handle no results

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
  ): Promise<LocationWeatherForecastType> {
    try {
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
