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
      pattern: '.yyyyMMdd',
      alwaysIncludePattern: true,
    },
    err: {
      //错误日志
      type: 'dateFile',
      numBackups: 30,
      filename: 'logs/errlog/err',
      pattern: '.yyyyMMdd',
      alwaysIncludePattern: true,
    },
    oth: {
      //其他日志
      type: 'dateFile',
      numBackups: 30,
      filename: 'logs/othlog/oth',
      pattern: '.yyyyMMdd',
      alwaysIncludePattern: true,
    },
    console: {
      type: 'console', // 会打印到控制台
    },
    access: {
      type: 'file', // 会写入文件，并按照日期分类
      filename: `${baseLogPath}/access/access.log`, // 日志文件名，会命名为：access.20200320.log
      alwaysIncludePattern: true,
      pattern: 'yyyyMMdd',
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
      pattern: 'yyyyMMdd',
      // maxLogSize: 10485760,
      numBackups: 3,
      keepFileExt: true,
    },
    errorFile: {
      type: 'dateFile',
      filename: `${baseLogPath}/errors/error.log`,
      alwaysIncludePattern: true,
      // layout: {
      //   type: 'pattern',
      //   pattern:
      //     '{"date":"%d","level":"%p","category":"%c","host":"%h","pid":"%z","data":\'%m\'}',
      // },
      // 日志文件按日期（天）切割
      pattern: 'yyyyMMdd',
      // maxLogSize: 10485760,
      numBackups: 30,
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
      appenders: ['console', 'app', 'errors'],
      level: 'trace',
    },
    info: { appenders: ['console', 'app', 'errors'], level: 'info' },
    http: { appenders: ['access'], level: 'trace' },
  },
};
