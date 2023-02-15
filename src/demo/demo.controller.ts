import {
  Controller,
  Body,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  Req,
  UsePipes,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DemoService, PostsRo } from './demo.service';
import { TestPipe } from '@src/core/pipe/transform.pipe';
import { DemoPostBody, DemoDto } from '@src/types/demo';
import { RolesGuard } from '@src/core/guard/roles.guard';
import { Roles } from '@src/core/custom.decorators/role.decorator';
import { LoggerInterceptor } from '@src/core/interceptor/logger.interceptor';
import { CustomLoggerService } from '@src/logger/logger.service';
// import { Logger } from '@src/utils/logger';

@Controller('demo')
export class DemoController {
  constructor(
    private readonly demoService: DemoService,
    private readonly customLoggerService: CustomLoggerService,
  ) {}

  /**
   * 创建
   * @param post
   * @description 在使用pipe的时候，会验证metatype，当请求的参数是class定义的类型时，回跳过validate
   */
  @Post()
  @UsePipes(new TestPipe())
  async create(@Body() post: DemoDto, @Param() id) {
    console.log('post===', post);
    // this.customLoggerService.http();
    // Logger.access('ssss');
    return await this.demoService.create(post);
  }

  /**
   * 获取所有
   */
  @Get('testPipe/:id')
  @UsePipes(new TestPipe())
  async findAll(@Param('id') idv: number): Promise<PostsRo> {
    console.log('query==', idv);
    return await this.demoService.findAll(idv);
  }

  /**
   * test metatype 是 undefined
   */
  @Get('testMetatype')
  @Roles('admin')
  @UseInterceptors(LoggerInterceptor)
  @UseGuards(new RolesGuard(new Reflector()))
  @UsePipes(new TestPipe())
  async testMetatype(@Query('d') query) {
    console.log('query==', query);
    return await this.demoService.findAll(1);
  }

  /**
   * 基于id获取
   */
  @Get(':id')
  @UsePipes(new TestPipe())
  async findById(@Param() params) {
    console.log('id==', params.id, typeof params.id);
    return this.demoService.findById(params.id);
  }

  /**
   * 更新
   * @param id
   * @param post
   */
  @Put(':id')
  async update(@Req() request, @Param('id') id, @Body() post) {
    return await this.demoService.updateById(id, post);
  }

  /**
   * 删除
   * @param id
   */
  @Delete(':id')
  async delete(
    @Param('id')
    id,
  ) {
    return await this.demoService.remove(id);
  }

  /**
   * post 参数是数组
   */
  @Post('bodyIsArray')
  async postBodyIsArray(@Body() post) {
    // post = [1,2,3]
    // 用postman 测试的时候， 需要用双引号 ["aa","bb","cc"]
    console.log('post==', post, post[0]);
    return { code: 1 };
  }
}
