import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception/http-exception.filter';
import { TransfromInterceptor } from './core/interceptor/transfrom.interceptor';
/**
 * 应用程序的入口文件，它使用核心函数NestFactory来创建nest应用程序实例
 * @author：wangshangzhe
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.setGlobalPrefix('bzl/bosshi');
  // 全局注册过滤器，对异常层具有完全控制权
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransfromInterceptor());
  await app.listen(3366);
}
bootstrap();
