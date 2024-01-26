import axios from 'axios';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

import { config } from '../config';
import {
  AreaMetadataType,
  ForecastType,
  LocationWeatherForecastType,
  WeatherForecastResponseType,
} from './types/weather';

@Injectable()
export class WeatherService {
  mapAreasToWeatherForecasts(
    areaMetadata: Array<AreaMetadataType>,
    forecasts: Array<ForecastType>,
  ): Array<LocationWeatherForecastType> {
    if (!areaMetadata?.length) return [];

    return areaMetadata.map((area) => {
      const { name, label_location } = area;
      const areaForecast = forecasts.find((forecast) => forecast.area === name);

      return {
        name,
        forecast: areaForecast.forecast,
        latitude: label_location.latitude,
        longitude: label_location.longitude,
      };
    });
  }

  async getWeatherForecastLocations(
    datetime: string,
  ): Promise<Array<LocationWeatherForecastType>> {
    const WEATHER_FORECAST_URL = `${config.weatherUrl}/2-hour-weather-forecast`;

    try {
      const { data }: WeatherForecastResponseType = await axios.get(
        `${WEATHER_FORECAST_URL}?date_time=${datetime}`,
      );

      const { area_metadata, items } = data;
      const forecasts = items?.[0]?.forecasts || [];

      return this.mapAreasToWeatherForecasts(area_metadata, forecasts);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }
}
