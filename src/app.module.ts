import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DemoModule } from './demo/demo.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigService, ConfigModule } from '@nestjs/config';
import envConfig from '../config/env';
import { DemoEntity } from './demo/demo.entity';
import { UserModule } from './user/user.module';
/**
 * 应用程序的根模块，根模块提供了用来启动应用的引导机制
 * @author: wangshnagzhe
 */
// @Module() 装饰器接收四个属性
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [envConfig.path],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        type: 'mysql',
        entities: [DemoEntity],
        host: configService.get('DB_HOST', 'localhost'),
        port: configService.get<number>('DB_PORT', 3306), // 端口号
        username: configService.get('DB_USER', 'root'), // 用户名
        password: configService.get('DB_PASSWORD', 'root123456'), // 密码
        database: configService.get('DB_DATABASE', 'monitor'), //数据库名
        timezone: '+08:00', //服务器上配置的时区
        // 数据库中有数据的话， 建议一定要谨慎点， 连接数据库时， 上来先把synchronize:false设置上， 保命要紧
        synchronize: true, //根据实体自动创建数据库表， 生产环境建议关闭
        // autoLoadEntities: false,
      }),
    }),
    DemoModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
