import { Test, TestingModule } from '@nestjs/testing';

import { ReportsController } from './reports.controller';
import { ReportsService } from './reports.service';
import {
  mockLogsData,
  mockMostSearchesPeriod,
  mockTopSearchesData,
} from '../common/mocks/reports';

describe('ReportsController', () => {
  let controller: ReportsController;
  let service: ReportsService;

  const mockService = {
    getRecentSearches: jest.fn().mockResolvedValue(mockLogsData),
    getRecentLocationSearches: jest.fn().mockResolvedValue(mockLogsData),
    getTopSearches: jest.fn().mockResolvedValue(mockTopSearchesData),
    getMostSearchesPeriod: jest.fn().mockResolvedValue(mockMostSearchesPeriod),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportsController],
      providers: [
        {
          provide: ReportsService,
          useValue: mockService,
        },
      ],
    }).compile();

    controller = module.get<ReportsController>(ReportsController);
    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('reports controllers', () => {
    it('should successfully return data for getRecentSearches', async () => {
      const result = await controller.getRecentSearches();
      expect(service.getRecentSearches).toHaveBeenCalled();
      expect(result).toEqual(mockLogsData);
    });

    it('should successfully return data for getRecentLocationSearches', async () => {
      const result = await controller.getRecentLocationSearches();
      expect(service.getRecentLocationSearches).toHaveBeenCalled();
      expect(result).toEqual(mockLogsData);
    });

    it('should successfully return data for getTopSearches', async () => {
      const result = await controller.getTopSearches(
        1706087760000,
        1706088780000,
      );
      expect(service.getTopSearches).toHaveBeenCalled();
      expect(result).toEqual(mockTopSearchesData);
    });

    it('should successfully return data for getMostSearchedPeriod', async () => {
      const result = await controller.getMostSearchedPeriod(
        1706087760000,
        1706088780000,
      );
      expect(service.getMostSearchesPeriod).toHaveBeenCalled();
      expect(result).toEqual(mockMostSearchesPeriod);
    });
  });
});
