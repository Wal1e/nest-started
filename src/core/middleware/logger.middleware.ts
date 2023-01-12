/**
 * 中间件函数可以执行以下任务:
执行任何代码。
对请求和响应对象进行更改。
结束请求-响应周期。
调用堆栈中的下一个中间件函数。
如果当前的中间件函数没有结束请求-响应周期, 它必须调用 next() 将控制传递给下一个中间件函数。否则, 请求将被挂起。
 */
// 希望有一个验证请求对象中的令牌的中间件和一个验证令牌有效负载中用户的身份验证守卫 https://qa.1r1g.com/sf/ask/4073754751/
import {
  HttpException,
  HttpStatus,
  Injectable,
  NestMiddleware,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { Logger } from '../../utils/logger';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('req.query==', req.query);
    console.log('req.body==', req.body);
    // res.send({
    //   data: 'ddd',
    // });
    // return;
    next();
    const statusCode = res.statusCode;
    console.log('statusCode==', statusCode);
    const logFormat = ` >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
      Request original url: ${req.originalUrl}
      Method: ${req.method}
      IP: ${req.ip}
      Status code: ${statusCode}
      Parmas: ${JSON.stringify(req.params)}
      Query: ${JSON.stringify(req.query)}
      Body: ${JSON.stringify(
        req.body,
      )} \n  >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
    `;
    // 根据状态码，进行日志类型区分
    if (statusCode >= 500) {
      Logger.error(logFormat);
    } else if (statusCode >= 400) {
      Logger.warn(logFormat);
    } else {
      Logger.access(logFormat);
      Logger.log(logFormat);
    }
    // next(
    //   new HttpException(
    //     'throw exception in loggerMidderware',
    //     HttpStatus.BAD_REQUEST,
    //   ),
    // );
  }
}

export function fnMiddle(req, res, next) {
  console.log('函数式中间件');
  next();
}
