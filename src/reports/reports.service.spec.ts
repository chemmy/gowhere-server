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

describe('ReportsService', () => {
  let service: ReportsService;

  const mockResult = [
    {
      id: 1,
      search_location: 'Location1',
      search_timestamp: 1234567890,
      searched_when: 1234567890,
    },
  ];

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
      getRawOne: jest.fn().mockResolvedValueOnce(mockResult),
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
      mockLogRepo.createQueryBuilder().getRawMany;

      expect(result).toEqual(mockResult);
    });
  });

  describe('getRecentLocationSearches', () => {
    it('should return recent location searches', async () => {
      const result = await service.getRecentLocationSearches();
      mockLogRepo.createQueryBuilder().getRawMany;

      expect(result).toEqual(mockResult);
    });
  });

  describe('getTopSearches', () => {
    it('should return recent searches', async () => {
      const result = await service.getTopSearches(123217, 128316);
      mockLogRepo.createQueryBuilder().getRawMany;

      expect(result).toEqual(mockResult);
    });
  });

  describe('getMostSearchesPeriod', () => {
    it('should return recent searches', async () => {
      const result = await service.getMostSearchesPeriod(123217, 128316);
      mockLogRepo.createQueryBuilder().getRawMany;

      expect(result).toEqual(mockResult);
    });
  });
});
