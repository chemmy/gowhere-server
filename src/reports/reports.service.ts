import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';
import {
  MostSearchesPeriodResponseType,
  TopSearchResponseType,
} from './types/report-response';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Log)
    private logRepo: Repository<Log>,
  ) {}

  async create(body: CreateLogDto): Promise<Log> {
    try {
      const log = this.logRepo.create(body);
      return await this.logRepo.save(log);
    } catch (error) {
      throw new InternalServerErrorException(error.message);
    }
  }

  async getRecentSearches(): Promise<Array<Log>> {
    Logger.log(`Retrieving recent searches`);

    try {
      return this.logRepo
        .createQueryBuilder('log')
        .select([
          'MIN(log.id) AS id',
          'log.search_location AS search_location',
          'log.search_timestamp AS search_timestamp',
          'MAX(log.searched_when) AS searched_when',
        ])
        .groupBy('log.search_location, log.search_timestamp')
        .orderBy('searched_when', 'DESC')
        .limit(10)
        .getRawMany();
    } catch (error) {
      const { message } = error;
      Logger.error(`Error retrieving recent searches`, message);
      throw new InternalServerErrorException(message);
    }
  }

  async getRecentLocationSearches(): Promise<Array<Log>> {
    Logger.log(`Retrieving recent location searches`);
    try {
      return this.logRepo
        .createQueryBuilder('log')
        .select([
          'MIN(log.id) AS id',
          'log.search_location AS search_location',
          'MAX(log.search_timestamp) AS search_timestamp',
          'MAX(log.searched_when) AS searched_when',
        ])
        .groupBy('log.search_location')
        .orderBy('searched_when', 'DESC')
        .limit(10)
        .getRawMany();
    } catch (error) {
      const { message } = error;
      Logger.error(`Error retrieving recent location searches`, message);
      throw new InternalServerErrorException(message);
    }
  }

  async getTopSearches(
    start: number,
    end: number,
  ): Promise<Array<TopSearchResponseType>> {
    const params = JSON.stringify({ start, end });
    Logger.log(`Retrieving top searches for ${params}`);

    try {
      return this.logRepo
        .createQueryBuilder('log')
        .select([
          'MIN(log.id) AS id',
          'log.search_location AS search_location',
          'log.search_timestamp AS search_timestamp',
          'CAST(COUNT(*) AS INTEGER) AS count',
        ])
        .groupBy('log.search_location, log.search_timestamp')
        .orderBy('count', 'DESC')
        .where('log.searched_when >= :start', { start })
        .andWhere('log.searched_when <= :end', { end })
        .limit(10)
        .getRawMany();
    } catch (error) {
      const { message } = error;
      Logger.error(`Error retrieving top searches for ${params}`, message);
      throw new InternalServerErrorException(message);
    }
  }

  async getMostSearchesPeriod(
    start: number,
    end: number,
  ): Promise<MostSearchesPeriodResponseType> {
    const ONE_HR_TIMESTAMP = 3600000;
    const params = JSON.stringify({ start, end });
    Logger.log(`Retrieving most searches for period ${params}`);

    try {
      return this.logRepo
        .createQueryBuilder('l1')
        .select([
          'to_timestamp(l1.searched_when / 1000) AS start_date',
          'CAST(COUNT(*) AS INTEGER) AS count',
        ])
        .leftJoin(
          'log',
          'l2',
          `l1.searched_when <= l2.searched_when AND l1.searched_when + ${ONE_HR_TIMESTAMP} >= l2.searched_when`,
        )
        .groupBy('l1.id')
        .where('l1.searched_when >= :start', { start })
        .andWhere('l1.searched_when <= :end', { end })
        .orderBy('count', 'DESC')
        .limit(1)
        .getRawOne();
    } catch (error) {
      const { message } = error;
      Logger.error(
        `Error retrieving most searches for period ${params}`,
        message,
      );
      throw new InternalServerErrorException(message);
    }
  }
}
