import { Body, Controller, Get, Param, Post, Put, Query } from '@nestjs/common';
import { EsService } from './es.service';

@Controller('es')
export class EsController {
  constructor(private readonly esService: EsService) {}
  /**
   * 根据appId获取
   * @returns
   */
  @Get('pans/api/appId:appId')
  async getHomeChartsList(@Param('appId') appId) {
    console.log('get');
  }

  /**
   * 查询所有
   * @returns
   */
  @Get('pans/api/search/all')
  async getByAppid(@Query() query) {
    console.log('query');
  }

  /**
   * 按条件查询
   * @returns
   */
  @Get('pans/api/search')
  async getByQuery(@Query() query) {
    console.log('query');
  }

  /**
   * 按时间区间查询
   * @returns
   */
  @Get('pans/api/search/time-range')
  async getByTimeRange(@Query() query) {
    console.log('query');
  }

  /**
   * 添加单条数据，现暂供开发测试阶段使用
   */
  @Post('pans/api/bulk')
  async bulkData(@Body() post) {
    console.log('post==', post);
  }

  /**
   * 埋点sdk sendlog会一次上报1-10条数据，批量添加数据
   */
  @Post('pans/api/batchBulk')
  async batchBulkData(@Body() post) {
    console.log('query');
  }

  /**
   * 创建index
   */
  @Put('pans/api/createIndex')
  async createIndex(@Body() post) {
    console.log('query');
  }
}
