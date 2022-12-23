/**
 * 中间件函数可以执行以下任务:
执行任何代码。
对请求和响应对象进行更改。
结束请求-响应周期。
调用堆栈中的下一个中间件函数。
如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。
 */

import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggerMiddle implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('Request...');
    // res.send({
    //   data: 'ddd',
    // });
    // return;
    next();
  }
}

export function fnMiddle(req, res, next) {
  console.log('函数式中间件');
  next();
}
