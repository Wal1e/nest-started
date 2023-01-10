import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

interface ReturnData {
  data: any;
  code: number;
  msg: string;
}
@Injectable()
export class TransfromInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map<any, ReturnData>((data) => {
        return {
          data,
          code: 0,
          msg: 'success',
        };
      }),
    );
  }
}
