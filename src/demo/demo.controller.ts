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
} from '@nestjs/common';
import { DemoService, PostsRo } from './demo.service';

@Controller('demo')
export class DemoController {
  constructor(private readonly demoService: DemoService) {}

  /**
   * 创建
   * @param post
   */
  @Post()
  async create(@Body() post) {
    console.log('post===', post);
    return await this.demoService.create(post);
  }

  /**
   * 获取所有
   */
  @Get()
  async findAll(@Query() query): Promise<PostsRo> {
    console.log('query==', query);
    return await this.demoService.findAll(query);
  }

  /**ß
   * 基于id获取
   */
  @Get(':id')
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
