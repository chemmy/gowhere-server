import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { WeatherService } from './weather.service';
import { InternalServerErrorException } from '@nestjs/common';
import {
  mappedLocationWeatherForecasts,
  mockedWeatherResponse,
} from '../common/mocks/locationsWeatherForecast';

describe('WeatherService', () => {
  let service: WeatherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WeatherService],
    }).compile();

    service = module.get<WeatherService>(WeatherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getWeatherForecastLocations', () => {
    const datetime = '2024-01-26T12:00:00Z';

    it('should return mapped weather forecasts', async () => {
      axios.get = jest.fn().mockResolvedValue(mockedWeatherResponse);
      const result = await service.getWeatherForecastLocations(datetime);
      expect(result).toEqual(mappedLocationWeatherForecasts);
    });

    it('should handle error and throw InternalServerErrorException', async () => {
      const errorMessage = 'Internal Server Error';
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        service.getWeatherForecastLocations(datetime),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
