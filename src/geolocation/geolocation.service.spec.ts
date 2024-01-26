import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { GeolocationService } from './geolocation.service';
import { RedisService } from '../common/utils/redis.service';
import { geocodedResponse } from '../common/mocks/geolocationData';
import { mappedLocationTrafficImages } from '../common/mocks/locationsTrafficImages';

describe('GeolocationService', () => {
  let service: GeolocationService;
  let redisService: RedisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [GeolocationService, RedisService],
    }).compile();

    service = module.get<GeolocationService>(GeolocationService);
    redisService = module.get<RedisService>(RedisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const coordinate = { latitude: 1.1, longitude: 1.2 };

  describe('getReverseGeocode', () => {
    it('should return expected results', async () => {
      axios.get = jest.fn().mockResolvedValue(geocodedResponse);
      const result = await service.getReverseGeocode(coordinate);
      expect(result).toEqual(geocodedResponse);
    });
  });

  describe('getReverseGeocodeOnRedis', () => {
    it('should return expected', async () => {
      const value = 'Someplace';
      redisService.getValue = jest.fn().mockResolvedValue(value);
      const result = await service.getReverseGeocodeOnRedis(coordinate);
      expect(result).toBe(value);
    });
  });

  describe('getLocationNamesFromCoordinates', () => {
    it('should include the name to the coordinates list from redis', async () => {
      const redisValue = 'Redis place';
      redisService.getValue = jest.fn().mockResolvedValue(redisValue);
      const result = await service.getLocationNamesFromCoordinates(
        mappedLocationTrafficImages,
      );
      const expected = mappedLocationTrafficImages.map((item) => {
        return { ...item, name: redisValue };
      });
      expect(result).toEqual(expected);
    });

    it('should include the name to the coordinates list from geocoding service if not available on redis', async () => {
      redisService.getValue = jest.fn().mockResolvedValue(null);
      axios.get = jest.fn().mockResolvedValue(geocodedResponse);
      const result = await service.getLocationNamesFromCoordinates(
        mappedLocationTrafficImages,
      );
      const expected = mappedLocationTrafficImages.map((item) => {
        return { ...item, name: 'New Road, The Suburb' };
      });
      expect(result).toEqual(expected);
    });
  });

  describe('calculateCoordinateDistance', () => {
    it('should return expected distance', () => {
      const actual = service.calculateCoordinateDistance(1, 2, 3, 4);
      expect(actual).toBe(314.40295102362484);
    });

    it('should still calculate distance even if some parameters are missing', () => {
      const actual = service.calculateCoordinateDistance(null, 2, undefined, 4);
      expect(actual).toBe(222.38985328911747);
    });
  });

  describe('findNearestCoordinates', () => {
    const coordinates = [
      { latitude: 1.291, longitude: 103.85 },
      { latitude: 1.3974, longitude: 103.854 },
      { latitude: 1.28036, longitude: 103.83 },
    ];

    it('should return nearest data from list of coordinates based on latitude and longitude even if distance is 0', () => {
      const actual = service.findNearestCoordinates(1.291, 103.85, coordinates);
      const expected = { latitude: 1.291, longitude: 103.85, distance: 0 };
      expect(actual).toEqual(expected);
    });

    it('should return nearest data from list of coordinates based on latitude and longitude', () => {
      const actual = service.findNearestCoordinates(1.36, 103.81, coordinates);
      const expected = {
        latitude: 1.3974,
        longitude: 103.854,
        distance: 6.42013658293214,
      };
      expect(actual).toEqual(expected);
    });

    it('should return null if the latitude and longitude are from from the list of coordinates', () => {
      const actual = service.findNearestCoordinates(1.56, 104.81, coordinates);
      expect(actual).toEqual(null);
    });
  });
});
