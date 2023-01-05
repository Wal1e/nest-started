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
  /**
   * 插入文档
   */
  @Put('index/doc')
  async indexDoc(@Param('appId') appId) {
    console.log('indexDoc');
    try {
      const res = await this.esService.index({
        index: 'test',
        type: '_doc',
        body: {
          first_name: 'John',
          last_name: 'Smith',
          age: 25,
          about: 'I love to go rock climbing',
          interests: ['sports', 'music'],
        },
      });
      return res;
    } catch (error) {
      console.log('error===', error);
    }
  }

  /**
   * 查询指定文档
   */
  @Get('search/:id')
  async getByAppid(@Param() param) {
    console.log('getByAppid');
    const res = await this.esService.search({
      index: 'test',
      type: '_doc',
      body: {
        query: {
          term: {
            _id: { value: 'fgBvd4UBTBV8j2Kcg1q_' },
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
  async getAll(@Query() query) {
    console.log('getAll');
    const res = await this.esService.searchALL({
      index: 'test',
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
  }

  /**
   * 更新文档
   * @returns
   */
  @Post('update/doc')
  async updateDoc(@Query() query) {
    const res = await this.esService.update({
      index: 'test',
      id: 'fgBvd4UBTBV8j2Kcg1q_',
      body: {
        doc: {
          first_name: 'John',
          last_name: 'Smith',
          age: 26,
          about: 'I love to go rock climbing',
          interests: ['sports', 'music'],
        },
      },
    });
    return res;
  }

  /**
   * 删除文档
   */
  @Delete('delete/doc')
  async deleteDoc(@Body() post) {
    console.log('deleteDoc==', post);
    const res = await this.esService.delete({
      index: 'test',
      type: '_doc',
      id: '77',
    });
    return res;
  }

  /**
   * 创建index
   */
  @Put('createIndex')
  async createIndex(@Body() post) {
    console.log('query');
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
