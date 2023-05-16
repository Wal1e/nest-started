import { Kafka, Consumer } from 'kafkajs';
import { getKafkaConfig } from 'config/env';

const kafkaConfig = getKafkaConfig();

let consumer!: Consumer;
const topic_foo = kafkaConfig.topic.foo;
const topic_boo = kafkaConfig.topic.boo;

/**
 * 获取kafka client
 * @returns kafka.KafkaClient
 */
function getKafakaClient(): Kafka {
  const kafkaClient = new Kafka({
    brokers: kafkaConfig.kafkaJsHost,
    clientId: 'example-consumer',
    // ssl: {
    //   rejectUnauthorized: true,
    // },
    sasl: {
      mechanism: 'plain',
      username: kafkaConfig.sasl.username,
      password: kafkaConfig.sasl.password,
    },
  });
  return kafkaClient;
}

/**
 * @description 获取kafka消费者实例
 */
export const getKafkaConsumerGroup = async () => {
  // 设置了几个分区，就要在收到offsetOutOfRange时，分别在所有分区的有效负载中设置新的偏移量
  const topics = [
    { topic: topic_foo, partition: 0 },
    { topic: topic_foo, partition: 1 },
    { topic: topic_foo, partition: 2 },
    { topic: topic_boo, partition: 0 },
    { topic: topic_boo, partition: 1 },
    { topic: topic_boo, partition: 2 },
  ];

  const options = {
    groupId: 'test-group-fe8',
  };
  const kafka = getKafakaClient();

  consumer = kafka.consumer(options);
  const run = async () => {
    await consumer.connect();
    await consumer.subscribe({ topics: [topic_foo, topic_boo] });
    await consumer.run({
      // eachBatch: async ({ batch }) => {
      //   console.log(batch)
      // },
      eachMessage: async ({ topic, partition, message }) => {
        const prefix = `${topic}[${partition} | ${message.offset}] / ${message.timestamp}`;
        console.log(`- ${prefix} ${message.key}#${message.value}`);
      },
    });
  };

  run().catch((e) => console.error(`[example/consumer] ${e.message}`, e));

  const errorTypes = ['unhandledRejection', 'uncaughtException'];
  const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2'];
  errorTypes.map((type) => {
    process.on(type, async (e) => {
      try {
        console.log(`process.on ${type}`);
        console.error(e);
        await consumer.disconnect();
        process.exit(0);
      } catch (_) {
        process.exit(1);
      }
    });
  });

  signalTraps.map((type) => {
    process.once(type, async () => {
      try {
        await consumer.disconnect();
      } finally {
        process.kill(process.pid, type);
      }
    });
  });

  return consumer;
};

export const getLatestOffsets = (offset) => {
  return new Promise((resolve, reject) => {
    offset.fetchLatestOffsets([topic_foo, topic_boo], (err, offsets) => {
      if (err) {
        console.log('fetchLatestOffsets-error=', err);
        reject(err);
      } else {
        resolve(offsets);
      }
    });
  });
};
