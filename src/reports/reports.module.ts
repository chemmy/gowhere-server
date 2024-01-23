import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ReportsService } from './reports.service';
import { Log } from './entities/log.entity';
import { ReportsController } from './reports.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Log])],
  providers: [ReportsService],
  controllers: [ReportsController],
})
export class ReportsModule {}
