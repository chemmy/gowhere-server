import { Test, TestingModule } from '@nestjs/testing';

import { LocationsController } from './locations.controller';
import { mappedLocationTrafficImages } from '../common/mocks/locationsTrafficImages';
import { LocationsService } from './locations.service';
import { mappedLocationWeatherForecasts } from '../common/mocks/locationsWeatherForecast';

describe('LocationsController', () => {
  let controller: LocationsController;
  let service: LocationsService;

  const mockService = {
    getTrafficLocations: jest
      .fn()
      .mockResolvedValue(mappedLocationTrafficImages),
    getWeatherForecast: jest
      .fn()
      .mockResolvedValue(mappedLocationWeatherForecasts),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocationsController],
      providers: [
        {
          provide: LocationsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<LocationsController>(LocationsController);
    service = module.get<LocationsService>(LocationsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('getLocationsTrafficImages', () => {
    it('should get a list of traffic with images', async () => {
      const result = await controller.getLocationsTrafficImages('2024-01-01');

      expect(service.getTrafficLocations).toHaveBeenCalled();
      expect(result).toEqual(mappedLocationTrafficImages);
    });
  });

  describe('getLocationsWeatherForecast', () => {
    it('should get the weather forecast for specific location and datetime', async () => {
      const result = await controller.getLocationsWeatherForecast(
        '2024-01-01',
        1.241,
        4.241,
        'Some, Place',
      );
      expect(service.getWeatherForecast).toHaveBeenCalled();
      expect(result).toEqual(mappedLocationWeatherForecasts);
    });
  });
});
