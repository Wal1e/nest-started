import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { indexName } from 'config/env';

@Injectable()
export class EsService {
  constructor(private readonly esService: ElasticsearchService) {
    console.log('constructor');
    // this.catHealth();
  }
  // 查看集群的健康状况
  public async catHealth() {
    const res = await this.esService.cat.health({});
    console.log('catHealth---res===', res);
    return res;
  }
  // 查询索引
  public async catIndex() {
    return await this.esService.cat.indices({});
  }
  // 新建索引
  public async createIndex(body) {
    return await this.esService.indices.create({
      index: indexName,
      body,
    });
  }
  // 删除索引
  public async deleteIndex() {
    return await this.esService.indices.delete({
      index: indexName,
    });
  }
  // 添加文档
  async index<T>(params) {
    return await this.esService.index(params);
  }
  // 从索引中检索指定的JSON文档
  async get(params) {
    return await this.esService.get(params);
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

  // reindex
  async reindex<T>(params) {
    return await this.esService.reindex(params);
  }

  // 获取索引映射
  async getMapping() {
    return await this.esService.indices.getMapping({
      index: indexName,
    });
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
  /**
   * fuzzy查询，当field的类型是keyword的时候，fuzzy查询该字段的时候，需要输入精确值
   * 所以keyword类型的field不适合于fuzzy、match查询
   * 场景： 在索引中存入了一个name对象 包含first和last两个属性，现要fuzzy查询first
   * name = { first: 'wang', last: 'sansui'}
   */
  async fuzzySearch() {
    return await this.esService.search({
      index: 'test',
      body: {
        query: {
          fuzzy: {
            'name.name': 'ios',
          },
        },
      },
    });
  }

  async getByQuery() {
    const body = {
      // query: {
      //   bool: {
      //     must: [
      //       {
      //         term: {
      //           logType: {
      //             value: 'performance',
      //           },
      //         },
      //       },
      //       {
      //         match: {
      //           'deviceInfo.osInfo': 'Android | 31',
      //         },
      //       },
      //     ],
      //   },
      // },
      // query: {
      //   term: {
      //     logType: {
      //       value: 'performance',
      //     },
      //   },
      // },
      query: {
        match: {
          'user.hobbies': {
            query: 'iOS',
          },
        },
      },
      // query: {
      //   fuzzy: {
      //     appId: {
      //       value: 'bli_jeykmtbdvn6smmfp',
      //     },
      //   },
      // },
    };

    return await this.esService.search({
      index: indexName,
      body,
    });
  }

  /**
   * match query
   */
  async matchSearch() {
    return await this.esService.search({
      index: indexName,
      body: {
        query: {
          match: {
            'foo.last': 'goog',
            // 'user.hobbies': 'football',
          },
          // match_phrase_prefix: {
          //   'user.name': {
          //     query: 'ios',
          //   },
          // },
        },
      },
    });
  }

  async aggsByTerms() {
    const body = {
      aggs: {
        hobbies: {
          terms: { field: 'user.hobbies.raw' },
        },
        lasts: {
          terms: { field: 'foo.last.keyword' },
        },
      },
    };

    return await this.esService.search({
      index: indexName,
      body,
    });
  }

  async setFielddata() {
    this.esService.indices.putMapping({
      index: indexName,
      body: {
        properties: {
          'user.name': {
            type: 'text',
            fielddata: false,
          },
        },
      },
    });
  }

  async deleteByQuery(gte, lte) {
    return this.esService.deleteByQuery({
      index: indexName,
      body: {
        query: {
          range: {
            reportTime: {
              gte,
              lte,
            },
          },
        },
      },
    });
  }

  async getEsILMSetting() {
    this.esService.cluster.getSettings();
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
