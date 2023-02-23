import * as kafka from 'kafka-node';
import { getKafkaConfig } from 'config/env';

const kafkaConfig = getKafkaConfig();

let kafkaConsumer!: kafka.Consumer;

/**
 * 获取kafka client
 * @returns kafka.KafkaClient
 */
function getKafakaClient(): kafka.KafkaClient {
  const kafkaClient = new kafka.KafkaClient({
    kafkaHost: kafkaConfig.kafkaHost,
  });
  return kafkaClient;
}

/**
 * @description 获取kafka消费者实例
 */
export const getKafkaConsumer = () => {
  const topics = [{ topic: kafkaConfig.topic }];
  const options = {};

  const kafkaClient = getKafakaClient();
  kafkaConsumer = new kafka.Consumer(kafkaClient, topics, options);
  return kafkaConsumer;
};
