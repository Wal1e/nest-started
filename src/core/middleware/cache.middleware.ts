import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction } from 'express';

@Injectable()
export class CacheMiddleware implements NestMiddleware {
  use(req: any, res: any, next: NextFunction) {
    console.log('paramMiddleware');
    next();
  }
}
