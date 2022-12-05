import { HttpException, Injectable, HttpStatus } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemoEntity } from './demo.entity';

export interface PostsRo {
  list: DemoEntity[];
  count: number;
}

@Injectable()
export class DemoService {
  constructor(
    // 注入对应数据库
    @InjectRepository(DemoEntity)
    private readonly demoRepository: Repository<DemoEntity>,
  ) {}

  // 创建
  async create(post: Partial<DemoEntity>): Promise<DemoEntity> {
    const { title } = post;
    if (!title) {
      throw new HttpException('缺少标题', HttpStatus.UNAUTHORIZED);
    }
    const doc = await this.demoRepository.findOne({ where: { title } });
    if (doc) {
      throw new HttpException('title已存在', 401);
    }
    return await this.demoRepository.save(post);
  }

  /**
   * 获取
   */
  async findAll(query): Promise<PostsRo> {
    const qb = await this.demoRepository.createQueryBuilder('demoTable');
    qb.where('1 = 1');
    qb.orderBy('demoTable.create_time', 'DESC');
    const count = await qb.getCount();
    const { pageNum = 1, pageSize = 10, ...params } = query;
    qb.limit(pageSize);
    qb.offset(pageSize * (pageNum - 1));

    const posts = await qb.getMany();
    return { list: posts, count: count };
  }

  /**
   * 根据id获取
   */

  async findById(id): Promise<DemoEntity> {
    // select * from demo where id = id
    // https://www.tabnine.com/code/javascript/functions/typeorm/Repository/findOne
    return this.demoRepository.findOne({
      where: {
        id,
      },
    });
  }

  /**
   * 更新
   */
  async updateById(id, post): Promise<DemoEntity> {
    const existPost = await this.demoRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id对应的数据不存在`, 401);
    }
    const updatedPost = this.demoRepository.merge(existPost, post);
    return this.demoRepository.save(updatedPost);
  }

  /**
   * 删除
   */
  async remove(id) {
    const existPost = await this.demoRepository.findOne({ where: { id } });
    if (!existPost) {
      throw new HttpException(`id对应的数据不存在`, 401);
    }
    await this.demoRepository.remove(existPost);
  }
}
