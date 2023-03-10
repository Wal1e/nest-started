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
import { indexName } from 'config/env';
import * as dayjs from 'dayjs';

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
  @Put('create/index')
  async createIndex() {
    const res = await this.esService.createIndex({
      mappings: {
        properties: {
          event: { type: 'text' },
          appId: { type: 'text' },
          appName: { type: 'text' },
          logType: { type: 'text' },
          isError: { type: 'boolean' },
          consumeTime: { type: 'integer' },
          // https://www.elastic.co/guide/cn/elasticsearch/guide/current/_finding_exact_values.html
          // https://www.elastic.co/guide/en/elasticsearch/reference/7.17/term-level-queries.html
          logMessage: { type: 'keyword' },
          reportTime: { type: 'date' },
          createTime: { type: 'date' },
          user: {
            properties: {
              name: { type: 'text' },
              hobbies: {
                type: 'text',
                fields: {
                  // https://www.elastic.co/guide/en/elasticsearch/reference/7.17/multi-fields.html
                  // 当需要用 terms 聚合的时候，需要 { field: 'user.hobbies.raw'}
                  raw: {
                    type: 'keyword',
                  },
                },
              },
            },
          },
          foo: {
            properties: {
              first: { type: 'text' },
              last: {
                type: 'text',
                fields: {
                  // https://www.elastic.co/guide/en/elasticsearch/reference/current/text.html
                  // 当需要用 terms 聚合的时候，需要 { field: 'foo.last.keyword'}
                  // Use the last field for searches.
                  // Use the last.keyword field for aggregations, sorting, or in scripts.
                  keyword: {
                    type: 'keyword',
                    ignore_above: 256,
                  },
                },
              },
            },
          },
        },
      },
    });
    return res;
  }
  // 删除索引
  @Delete('delete/index')
  async deleteIndex() {
    const res = this.esService.deleteIndex();
    return res;
  }
  /**
   * 插入文档
   */
  @Put('index/doc')
  async indexDoc(@Body() post) {
    console.log('indexDoc-post==', post);
    post.user = {
      name: 'iOS16.0',
      hobbies: 'iOS16.6 football',
    };
    post.foo = {
      first: 'tomluck',
      last: 'Googluck',
    };
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
    const { id = '' } = query;
    const res = await this.esService.get({
      index: indexName,
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
    const { id = '' } = query;
    const res = await this.esService.search({
      index: indexName,
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
  @Get('searchAll')
  async getAll() {
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
  @Get('get/mapping')
  async getMapping() {
    const res = this.esService.getMapping();
    return res;
  }
  /**
   * @description bulk api
   * @usage 在单个API调用中执行多个索引或删除操作。这减少了开销，并可以大大提高索引速度。
   */
  @Post('query')
  async getByQuery() {
    const res = await this.esService.getByQuery();
    return res;
  }

  @Post('pans/api/batchBulk')
  async batchBulkData(@Body() post) {
    console.log('query');
  }

  @Get('matchText')
  async matchText() {
    const res = this.esService.matchSearch();
    return res;
  }

  @Put('putMapping')
  async putMapping() {
    const res = this.esService.setFielddata();
    return res;
  }

  @Get('aggsByTerms')
  async aggsByTerms() {
    // try {
    //   const res = await this.esService.aggsByTerms();
    //   return res;
    // } catch (error) {
    //   console.log('aggsByTerms error===', error);
    // }
    const res = await this.esService.aggsByTerms();
    return res;
  }

  @Post('deleteByQuery')
  async deleteByQuery() {
    const before = dayjs().subtract(1, 'days'); // 2022 12 16 21:13:36
    const beforeStart = before.startOf('date').valueOf(); // 2022 12 16 00:00:00
    const beforeEnd = before.endOf('date').valueOf(); // 2022 12 16 23:59:59
    const todayStart = dayjs().startOf('date').valueOf();
    const todayNowByHour = dayjs().startOf('hour').valueOf();
    const today_gte = todayStart;
    const today_lt = todayNowByHour + 60 * 60 * 1000;
    const res = await this.esService.deleteByQuery(
      1671206400000,
      1671292800000,
    );
    return res;
  }
}
