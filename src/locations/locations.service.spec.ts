import { Test, TestingModule } from '@nestjs/testing';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getRepositoryToken,
} from '@nestjs/typeorm';
import axios from 'axios';
import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';

import { LocationsService } from './locations.service';
import { TrafficService } from '../traffic/traffic.service';
import { WeatherService } from '../weather/weather.service';
import { GeolocationService } from '../geolocation/geolocation.service';
import { ReportsService } from '../reports/reports.service';
import { LocationsController } from './locations.controller';
import { Log } from '../reports/entities/log.entity';
import { RedisService } from '../common/utils/redis.service';
import {
  mockedTrafficResponse,
  locationTrafficImagesData,
} from '../common/mocks/locationsTrafficImages';
import { mockedWeatherResponse } from '../common/mocks/locationsWeatherForecast';
import { dbConfig } from '../config';

describe('LocationsService', () => {
  let service: LocationsService;
  let redisService: RedisService;

  const mockLogRepo = {
    create: jest.fn(),
    save: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LocationsService,
        TrafficService,
        WeatherService,
        GeolocationService,
        ReportsService,
        RedisService,
        {
          provide: getRepositoryToken(Log),
          useValue: mockLogRepo,
        },
      ],
      controllers: [LocationsController],
      imports: [
        TypeOrmModule.forRoot(dbConfig as TypeOrmModuleOptions),
        TypeOrmModule.forFeature([Log]),
      ],
    }).compile();

    service = module.get<LocationsService>(LocationsService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const datetime = '2024-01-26T12:00:00Z';

  describe('getTrafficLocations', () => {
    it('should return expected location with name, coordinates and images', async () => {
      const locationName = 'Someplace';
      axios.get = jest.fn().mockResolvedValue(mockedTrafficResponse);
      redisService.getValue = jest.fn().mockResolvedValue(locationName);

      const result = await service.getTrafficLocations(datetime);
      const expected = locationTrafficImagesData.map((item) => {
        const { camera_id, location, image } = item;
        return {
          id: camera_id,
          name: locationName,
          image,
          ...location,
        };
      });
      expect(result).toEqual(expected);
    });

    it('should handle error and throw InternalServerErrorException', async () => {
      const errorMessage = 'Internal Server Error';
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.getTrafficLocations(datetime)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('getWeatherForecast', () => {
    const latitude = 1.397;
    const longitude = 103.65;

    it('should return the weather forecast of a specific location with date and time', async () => {
      axios.get = jest.fn().mockResolvedValue(mockedWeatherResponse);

      const result = await service.getWeatherForecast(
        datetime,
        latitude,
        longitude,
      );

      const expected = {
        distance: 22.677064368353925,
        forecast: 'Rainy',
        latitude: 1.3974,
        longitude: 103.854,
        name: 'Area2',
      };
      expect(result).toEqual(expected);
    });

    it('should return 404 error if no are found close to coordinates', async () => {
      axios.get = jest.fn().mockResolvedValue(mockedWeatherResponse);

      await expect(
        service.getWeatherForecast(datetime, 2.41, 80.235),
      ).rejects.toThrow(NotFoundException);
    });

    it('should handle error and throw InternalServerErrorException', async () => {
      const errorMessage = 'Internal Server Error';
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      await expect(
        service.getWeatherForecast(datetime, 2.41, 80.235),
      ).rejects.toThrow(InternalServerErrorException);
    });
  });
});
