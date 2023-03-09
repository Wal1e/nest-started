import * as path from 'path';
const baseLogPath = path.resolve(__dirname, '../../logs'); // 日志要写入哪个目录
console.log('baseLogPath==', baseLogPath);
export const log4jsConfigure = {
  appenders: {
    stdout: {
      //控制台输出
      type: 'console',
    },
    req: {
      //请求转发日志
      type: 'dateFile', //指定日志文件按时间打印
      numBackups: 30,
      filename: 'logs/reqlog/req', //指定输出文件路径
      pattern: '.yyyy-MM-dd',
      alwaysIncludePattern: true,
    },
    console: {
      type: 'console', // 会打印到控制台
    },
    access: {
      type: 'file', // 会写入文件，并按照日期分类
      filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.20200320.log
      alwaysIncludePattern: true,
      pattern: 'yyyy-MM-dd',
      daysToKeep: 3,
      numBackups: 3,
      category: 'http',
      keepFileExt: true, // 是否保留文件后缀
    },
    app: {
      type: 'dateFile',
      filename: `${baseLogPath}/app-out/app.log`,
      alwaysIncludePattern: true,
      // layout: {
      //   type: 'pattern',
      //   pattern:
      //     '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      // },
      // 日志文件按日期（天）切割
      pattern: 'yyyy-MM-dd',
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: false,
      // 日志文件按日期（天）切割
      pattern: 'yyyy-MM-dd',
      // maxLogSize: 10485760,
      daysToKeep: 1,
      numBackups: 10,
      keepFileExt: true,
    },
    errors: {
      type: 'logLevelFilter',
      level: 'error',
      appender: 'errorFile',
    },
  },
  categories: {
    default: {
      appenders: ['console', 'access', 'app', 'errors'],
      level: 'trace',
    },
    mysql: { appenders: ['access', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'DEBUG' },
    log: { appenders: ['console'], level: 'info' },
  },
};
