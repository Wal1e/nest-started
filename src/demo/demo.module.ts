import { Module } from '@nestjs/common';
import { DemoController } from './demo.controller';
import { DemoService } from './demo.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DemoEntity } from './demo.entity';

@Module({
  // 导入TypeOrmModule,因为用到了导入TypeOrmModule的服务
  imports: [TypeOrmModule.forFeature([DemoEntity])],
  controllers: [DemoController],
  providers: [DemoService],
})
export class DemoModule {}
