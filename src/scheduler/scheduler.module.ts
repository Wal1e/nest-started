import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { EsModule } from '../es/es.module';

@Module({
  imports: [EsModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
