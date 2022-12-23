/* eslint-disable @typescript-eslint/ban-types */
/**
 * 管道有两个类型
 * 转换: 管道将输入的数据转换为所需的数据输出
 * 验证：对输入的数据进行验证，如果验证成功继续传递，验证失败则抛出异常
 */
import {
  ArgumentMetadata,
  HttpException,
  HttpStatus,
  PipeTransform,
} from '@nestjs/common';
import { Injectable, ValidationPipe } from '@nestjs/common';

@Injectable()
export class TestPipe implements PipeTransform {
  transform(value: any, metadata: ArgumentMetadata) {
    const { metatype } = metadata;
    if (!this.toValidate(metatype)) {
      console.log('在pipe中抛出的异常，会在异常过滤器中被捕获');
      // throw new HttpException('Validation failed', HttpStatus.BAD_REQUEST);
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
