import { IsInt, Max, Min } from 'class-validator';
/**
 * nest class-validator验证修饰器中文文档: https://blog.csdn.net/qq_38734862/article/details/117265394
 */

export class PageDTO {
  @IsInt({ message: '参数$property要求是整数!, 您输入的值是:$value' })
  @Min(1, { message: '参数$property最小值是1, 您输入的值是:$value' })
  @Max(1000, { message: '参数$property最大值是1000, 您输入的值是:$value' })
  pageSize: number;

  @IsInt({ message: '参数pageNo要求是整数!' })
  @Min(1, { message: '参数pageNo的值从1开始' })
  pageNo: number;
}
