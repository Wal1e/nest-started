import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
/**
 * 单个路由的基本控制器
 * @author wangshangzhe
 */
@Controller('bzl')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('hello')
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('size')
  getSize(): string {
    return '333';
  }

  /**
   * 通配符
   */
  @Get('user_*')
  getUser() {
    return 'user通配符';
  }

  /**
   * 带参数路径
   */
  @Get('foo/:id')
  getById() {
    return `getById`;
  }
}
