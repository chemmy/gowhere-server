import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Log } from './entities/log.entity';
import { CreateLogDto } from './dto/create-log.dto';

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
}
