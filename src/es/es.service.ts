import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

@Injectable()
export class EsService {
  constructor(private readonly esService: ElasticsearchService) {
    console.log('constructor');
  }
  // 查询索引
  public async queryIndex() {
    return await this.esService.cat.indices({});
  }
  // 新建索引
  public async createIndex(indexName, body) {
    return await this.esService.indices.create({
      index: indexName,
      body,
    });
  }
  // 删除索引
  public async deleteIndex(indexName) {
    return await this.esService.indices.delete({
      index: indexName,
    });
  }
  // 索引文档
  async index<T>(params) {
    return await this.esService.index(params);
  }

  // 查询数据search
  async searchALL<T>(params) {
    return await this.esService.search(params);
  }

  // 查询数据search
  async search<T>(params) {
    return await this.esService.search(params);
  }

  // 更新doc
  async update<T>(params) {
    return await this.esService.update(params);
  }

  // 删除doc
  async delete<T>(params) {
    return await this.esService.delete(params);
  }

  // 以下是一些常用的查询语句
  // exists 查询和 missing 查询, 用于查找那些指定字段中有值 (exists) 或无值 (missing) 的文档
  async searchByExists() {
    return await this.esService.search({
      index: 'test',
      body: {
        query: {
          bool: {
            filter: {
              exists: {
                field: 'last_name',
              },
            },
          },
        },
      },
    });
  }
  async searchByMissing() {
    return await this.esService.search({
      index: 'test',
      body: {
        query: {
          bool: {
            filter: {
              missing: {
                field: 'appId',
              },
            },
          },
        },
      },
    });
  }
}

// bool查询
// {
//   index:'mydatabase',
//   body: {
//     query: {
//       bool: {
//         must: [
//           {
//             match: {
//               platform: 'APP'
//             }
//           },
//           {
//             match: {
//               env: 'dev'
//             }
//           },
//           {
//             range: {
//               created_at: {
//                 gte: '2019-06-14T01:21:06.599Z',
//                 lt: '2019-06-17T01:21:06.599Z'
//               }
//             }
//           }
//         ]
//       }
//     },
//     from: 0,
//     size: 10,
//     sort: [{
//       created_at: {
//         order: 'desc'
//       }
//     }]
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { SearchService } from '@src/core/es/search.service';
// import { CommonSerachBody } from '@src/core/types/common';
// @Injectable()
// export class HomeService {
//   constructor(private readonly elasticsearchService: SearchService) {}
//   public async get<T>(parmas) {
//     // 组合拼装来源database的数据，作为controller的数据提供者及业务service
//     const searchRes = await this.elasticsearchService.test<CommonSerachBody<T>>(
//       {
//         index: 'pans-index-demo',
//         body: parmas,
//       },
//     );
//     const res = searchRes.body.hits.hits.map((hit) => {
//       return hit._source;
//     });
//     return res;
//   }

//   public async searchAggs<T>(parmas) {
//     // 组合拼装来源database的数据，作为controller的数据提供者及业务service
//     const searchRes = await this.elasticsearchService.searchAggs<
//       CommonSerachBody<T>
//     >({
//       index: 'lwh_test_news1',
//       body: parmas,
//     });
//     // searchResconsole.log(searchRes)
//     const res = searchRes.body.hits.hits.map((hit) => {
//       return hit._source;
//     });
//     return res;
//   }

//   public async searchAggByTimeRange<T>(parmas) {
//     // 组合拼装来源database的数据，作为controller的数据提供者及业务service
//     const searchRes = await this.elasticsearchService.search<
//       CommonSerachBody<T>
//     >({
//       index: 'pans-index-demo',
//       // type: 'doc',
//       body: {
//         query: {
//           bool: {
//             must: [
//               {
//                 term: {
//                   appId: {
//                     // value: 'bzl_dahdia',
//                     value: 'bzl_miniapp2',
//                   },
//                 },
//               },
//               // {
//               //   term: {
//               //     logType: {
//               //       value: 'request',
//               //     },
//               //   },
//               // },
//               // {
//               //   term: {
//               //     consumeTime: {
//               //       value: 660,
//               //     },
//               //   },
//               // },
//               {
//                 range: {
//                   createTime: {
//                     gte: '2022-12-14T10:30:10Z',
//                     lt: '2022-12-14T10:41:10Z',
//                   },
//                 },
//               },
//             ],
//           },
//         },
//         aggs: {
//           errorRange: {
//             date_histogram: {
//               field: 'createTime',
//               calendar_interval: '1m',
//             },
//             aggs: {
//               errorType: {
//                 terms: {
//                   field: 'isError',
//                 },
//               },
//             },
//           },
//           apiTerms: {
//             terms: {
//               field: 'isError',
//             },
//           },
//         },
//       },
//     });
//     // searchResconsole.log(searchRes)
//     const res = searchRes.body.hits.hits.map((hit) => {
//       return hit._source;
//     });
//     return res;
//   }

//   public async bulk<T>(params) {
//     return await this.elasticsearchService.bulk<T>({
//       body: [{ index: { _index: 'pans-index-demo' } }, params],
//     });
//   }

//   public async batchBulk<T>(params) {
//     // return await this.elasticsearchService.bulk({
//     //   body: [{ index: { _index: 'lwh_test_news1', _type: 'doc' } }],
//     // });
//   }

//   public async createIndex<T>() {
//     return await this.elasticsearchService.createIndex();
//   }
// }

// import { Injectable } from '@nestjs/common';
// import { SearchService } from '@src/core/es/search.service';
// import { CommonSerachBody } from '@src/core/types/common';
// @Injectable()
// export class HomeService {
//   constructor(private readonly elasticsearchService: SearchService) {}
//   public async get<T>(parmas) {
//     // 组合拼装来源database的数据，作为controller的数据提供者及业务service
//     const searchRes = await this.elasticsearchService.test<CommonSerachBody<T>>(
//       {
//         index: 'pans-index-demo',
//         body: parmas,
//       },
//     );
//     const res = searchRes.body.hits.hits.map((hit) => {
//       return hit._source;
//     });
//     return res;
//   }

//   public async searchAggs<T>(parmas) {
//     // 组合拼装来源database的数据，作为controller的数据提供者及业务service
//     const searchRes = await this.elasticsearchService.searchAggs<
//       CommonSerachBody<T>
//     >({
//       index: 'lwh_test_news1',
//       body: parmas,
//     });
//     // searchResconsole.log(searchRes)
//     const res = searchRes.body.hits.hits.map((hit) => {
//       return hit._source;
//     });
//     return res;
//   }

//   public async searchAggByTimeRange<T>(parmas) {
//     // 组合拼装来源database的数据，作为controller的数据提供者及业务service
//     const searchRes = await this.elasticsearchService.search<
//       CommonSerachBody<T>
//     >({
//       index: 'pans-index-demo',
//       // type: 'doc',
//       body: {
//         query: {
//           bool: {
//             must: [
//               {
//                 term: {
//                   appId: {
//                     // value: 'bzl_dahdia',
//                     value: 'bzl_miniapp2',
//                   },
//                 },
//               },
//               // {
//               //   term: {
//               //     logType: {
//               //       value: 'request',
//               //     },
//               //   },
//               // },
//               // {
//               //   term: {
//               //     consumeTime: {
//               //       value: 660,
//               //     },
//               //   },
//               // },
//               {
//                 range: {
//                   createTime: {
//                     gte: '2022-12-14T10:30:10Z',
//                     lt: '2022-12-14T10:41:10Z',
//                   },
//                 },
//               },
//             ],
//           },
//         },
//         aggs: {
//           errorRange: {
//             date_histogram: {
//               field: 'createTime',
//               calendar_interval: '1m',
//             },
//             aggs: {
//               errorType: {
//                 terms: {
//                   field: 'isError',
//                 },
//               },
//             },
//           },
//           apiTerms: {
//             terms: {
//               field: 'isError',
//             },
//           },
//         },
//       },
//     });
//     // searchResconsole.log(searchRes)
//     const res = searchRes.body.hits.hits.map((hit) => {
//       return hit._source;
//     });
//     return res;
//   }
