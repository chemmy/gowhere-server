import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsService } from './reports.service';
import { Log } from './entities/log.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [ReportsService],
})
export class ReportsModule {}
