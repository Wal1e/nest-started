import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './core/filter/http-exception.filter';
import { AllExceptionFilter } from './core/filter/all-exception-filter';
import { TransfromInterceptor } from './core/interceptor/transfrom.interceptor';
/**
 * 应用程序的入口文件，它使用核心函数NestFactory来创建nest应用程序实例
 * @author：wangshangzhe
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // 启用cors
  app.enableCors();
  // app.use((req, res, next) => {
  //   res.header('Access-Control-Allow-Origin', '*');
  //   res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  //   res.header('Access-Control-Allow-Headers', 'Content-Type, Accept');
  //   next();
  // });
  // app.setGlobalPrefix('test');
  // 全局注册过滤器，对异常层具有完全控制权
  // 注意：AllExceptionsFilter 要在 HttpExceptionFilter 的上面，否则 HttpExceptionFilter 就不生效了，全被 AllExceptionsFilter 捕获了。
  app.useGlobalFilters(new AllExceptionFilter());
  app.useGlobalFilters(new HttpExceptionFilter());
  // 全局注册拦截器
  app.useGlobalInterceptors(new TransfromInterceptor());
  await app.listen(3366);
}
bootstrap();
