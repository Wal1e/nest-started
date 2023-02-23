import * as fs from 'fs';
import * as path from 'path';

interface IPath {
  path: string;
}
const isProd = process.env.NODE_ENV;
function getEnvPath(): IPath {
  const devEnv = path.resolve('.env');
  const prodEnv = path.resolve('.env.prod');

  if (!fs.existsSync(devEnv) && !fs.existsSync(prodEnv)) {
    throw new Error('根目录缺少配置文件');
  }

  const envPth = isProd && fs.existsSync(prodEnv) ? prodEnv : devEnv;
  return { path: envPth };
}

export const getKafkaConfig = () => {
  return {
    kafkaHost: '',
    topic: '',
  };
};

export default getEnvPath();
