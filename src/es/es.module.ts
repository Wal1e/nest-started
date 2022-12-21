import { Module } from '@nestjs/common';
import { EsService } from './es.service';
import { EsController } from './es.controller';

@Module({
  controllers: [EsController],
  providers: [EsService],
})
export class EsModule {}
