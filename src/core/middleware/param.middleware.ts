import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class ParamMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    // req.user = {
    //   name: 'wsz',
    // };
    console.log('paramMiddleware');
    next();
  }
}
