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
} from '@nestjs/common';
import { DemoService, PostsRo } from './demo.service';
import { TestPipe } from '@src/core/pipe/transform.pipe';
import { DemoPostBody, DemoDto } from '@src/types/demo';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  /**
   * 创建
   * @param post
   */
  @Post()
  @UsePipes(new TestPipe())
  async create(@Body() post: DemoDto) {
    console.log('post===', post);
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
  async fundById(@Param() params) {
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
}
