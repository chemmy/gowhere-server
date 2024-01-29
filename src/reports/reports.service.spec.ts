import { Test, TestingModule } from '@nestjs/testing';
import {
  TypeOrmModule,
  TypeOrmModuleOptions,
  getRepositoryToken,
} from '@nestjs/typeorm';

import { ReportsService } from './reports.service';
import { Log } from './entities/log.entity';
import { ReportsController } from './reports.controller';
import { dbConfig } from '../config';
import { dateToIsoString } from '../common/utils/date';

describe('ReportsService', () => {
  let service: ReportsService;

  const start_timestamp = 1706279940507;
  const end_timestamp = 1706494139998;

  const mockResult = [
    {
      id: 1,
      search_location: 'Location1',
      search_timestamp: start_timestamp,
      searched_when: end_timestamp,
    },
  ];

  const mockMostSearchesData = {
    start_date: dateToIsoString(new Date(start_timestamp)),
    count: 20,
  };

  const mockLogRepo = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    createQueryBuilder: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      leftJoin: jest.fn().mockReturnThis(),
      where: jest.fn().mockReturnThis(),
      andWhere: jest.fn().mockReturnThis(),
      groupBy: jest.fn().mockReturnThis(),
      orderBy: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      getRawOne: jest.fn().mockResolvedValueOnce(mockMostSearchesData),
      getRawMany: jest.fn().mockResolvedValueOnce(mockResult),
    })),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReportsService,
        {
          provide: getRepositoryToken(Log),
          useValue: mockLogRepo,
        },
      ],
      controllers: [ReportsController],
      imports: [
        TypeOrmModule.forRoot(dbConfig as TypeOrmModuleOptions),
        TypeOrmModule.forFeature([Log]),
      ],
    }).compile();

    service = module.get<ReportsService>(ReportsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    const search_location = 'Some, Place';
    const search_timestamp = 1706097060000;
    const searched_when = new Date().valueOf();

    it('should successfully save log', async () => {
      const createLogDto = { search_location, search_timestamp };
      const savedLog: Log = {
        id: 1,
        search_location,
        search_timestamp,
        searched_when,
        setDefaultSearchedWhen: () => Date.now(),
      };

      mockLogRepo.create.mockReturnValue(createLogDto);
      mockLogRepo.save.mockResolvedValue(savedLog);

      const result = await service.create(createLogDto);

      expect(result).toEqual(savedLog);
      expect(mockLogRepo.create).toHaveBeenCalledWith(createLogDto);
      expect(mockLogRepo.save).toHaveBeenCalledWith(createLogDto);
    });
  });

  describe('getRecentSearches', () => {
    it('should return recent searches', async () => {
      const result = await service.getRecentSearches();

      expect(result).toEqual(mockResult);
    });
  });

  describe('getRecentLocationSearches', () => {
    it('should return recent location searches', async () => {
      const result = await service.getRecentLocationSearches();

      expect(result).toEqual(mockResult);
    });
  });

  describe('getTopSearches', () => {
    it('should return top searches', async () => {
      const result = await service.getTopSearches(
        start_timestamp,
        start_timestamp,
      );

      expect(result).toEqual(mockResult);
    });
  });

  describe('getMostSearchesPeriod', () => {
    it('should return most searches in a period', async () => {
      const result = await service.getMostSearchesPeriod(
        start_timestamp,
        end_timestamp,
      );

      expect(result).toEqual(mockMostSearchesData);
    });
  });
});
