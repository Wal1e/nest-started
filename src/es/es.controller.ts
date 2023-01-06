import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { EsService } from './es.service';

@Controller('es')
export class EsController {
  constructor(private readonly esService: EsService) {}
  // 查看集群的健康状况
  @Get('cat/health')
  async catHealth() {
    const res = await this.esService.catHealth();
    return res;
  }
  // 查询索引
  @Get('cat/indices')
  async catIndices() {
    const res = await this.esService.catIndex();
    return res;
  }
  // 新建索引
  @Put('create/index/:indexName')
  async createIndex(@Param('indexName') indexName) {
    const res = await this.esService.createIndex(indexName, {
      mappings: {
        properties: {
          event: { type: 'text' },
          appId: { type: 'text' },
          appName: { type: 'text' },
          logType: { type: 'text' },
          isError: { type: 'boolean' },
          consumeTime: { type: 'integer' },
          reportTime: { type: 'date' },
          createTime: { type: 'date' },
        },
      },
    });
    return res;
  }
  // 删除索引
  @Delete('delete/index/:indexName')
  async deleteIndex(@Param('indexName') indexName) {
    const res = this.esService.deleteIndex(indexName);
    return res;
  }
  /**
   * 插入文档
   */
  @Put('index/doc/:indexName')
  async indexDoc(@Param('indexName') indexName, @Body() post) {
    console.log('indexDoc-post==', post);
    try {
      const res = await this.esService.index({
        index: indexName,
        type: '_doc',
        body: post,
      });
      return res;
    } catch (error) {
      console.log('error===', error);
    }
  }

  /**
   * 从索引中检索指定的JSON文档
   */
  @Get('retrieve/doc')
  async retrieveDoc(@Query() query) {
    const { index = '', id = '' } = query;
    const res = await this.esService.get({
      index,
      id,
    });
    return res;
  }

  /**
   * 查询指定文档
   */
  @Get('search')
  async getByAppid(@Query() query) {
    console.log('getByAppid-param=', query);
    const { index = '', id = '' } = query;
    const res = await this.esService.search({
      index,
      type: '_doc',
      body: {
        query: {
          term: {
            _id: { value: id },
            // appId: { value: 'dahdia23444' },
          },
        },
      },
    });
    return res;
  }

  /**
   * 查询所有文档
   * @returns
   */
  @Get('searchAll/:indexName')
  async getAll(@Param('indexName') indexName) {
    console.log('getAll');
    const res = await this.esService.searchALL({
      index: indexName,
      body: {
        query: {
          match_all: {},
        },
      },
    });
    return res;
  }

  /**
   * @description 查询的appName字段中包含单词aaa，并按照创建时间升序排列
   */
  @Get('searchByMatch/sort')
  async searchByMatch_Sort() {
    const res = await this.esService.search({
      index: 'test',
      body: {
        query: {
          match: {
            appName: 'aaa',
          },
        },
        sort: [
          {
            createTime: {
              order: 'asc',
            },
          },
        ],
      },
    });
    return res;
  }

  /**
   * 更新文档
   * @returns
   */
  @Post('update/doc')
  async updateDoc(@Body() post) {
    const { index, id, data } = post;
    const res = await this.esService.update({
      index,
      id,
      body: {
        doc: data,
      },
    });
    return res;
  }

  /**
   * 删除文档
   */
  @Delete('delete/doc')
  async deleteDoc(@Query() query) {
    console.log('deleteDoc==', query);
    const { index = '', id = '' } = query;
    const res = await this.esService.delete({
      index,
      type: '_doc',
      id,
    });
    return res;
  }
  /**
   * 将文档从源复制到目标
   */
  @Post('reindex')
  async reindex() {
    const res = this.esService.reindex({
      body: {
        source: {
          index: 'my-index-000001',
        },
        dest: {
          index: 'my-new-index-000001',
        },
      },
    });
    return res;
  }

  /**
   * 获取索引的映射类型
   */
  @Get('get/mapping/:indexName')
  async getMapping(@Param('indexName') indexName) {
    const res = this.esService.getMapping(indexName);
    return res;
  }
  /**
   * @description bulk api
   * @usage 在单个API调用中执行多个索引或删除操作。这减少了开销，并可以大大提高索引速度。
   */
  @Post('bulk')
  async bulkOperation() {
    console.log('bulk');
  }

  /**
   * 埋点sdk sendlog会一次上报1-10条数据，批量添加数据
   */
  @Post('pans/api/batchBulk')
  async batchBulkData(@Body() post) {
    console.log('query');
  }
}
