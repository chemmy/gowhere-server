import { Test, TestingModule } from '@nestjs/testing';
import axios from 'axios';

import { TrafficService } from './traffic.service';
import {
  mappedLocationTrafficImages,
  mockedTrafficResponse,
} from '../common/mocks/locationsTrafficImages';
import { InternalServerErrorException } from '@nestjs/common';

describe('TrafficService', () => {
  let service: TrafficService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TrafficService],
    }).compile();

    service = module.get<TrafficService>(TrafficService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getTrafficImages', () => {
    const datetime = '2024-01-26T12:00:00Z';

    it('should return mapped weather forecasts', async () => {
      axios.get = jest.fn().mockResolvedValue(mockedTrafficResponse);
      const result = await service.getTrafficImages(datetime);
      expect(result).toEqual(mappedLocationTrafficImages);
    });

    it('should handle error and throw InternalServerErrorException', async () => {
      const errorMessage = 'Internal Server Error';
      (axios.get as jest.Mock).mockRejectedValueOnce(new Error(errorMessage));
      await expect(service.getTrafficImages(datetime)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
