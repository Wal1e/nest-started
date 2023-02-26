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
  const topic = kafkaConfig.topic;
  // 设置了几个分区，就要在收到offsetOutOfRange时，分别在所有分区的有效负载中设置新的偏移量
  const topics = [
    { topic, partition: 0 },
    { topic, partition: 1 },
    { topic, partition: 2 },
  ];
  // Auto commit config
  // const options = {
  //   //  自动提交配置   (false 不会提交偏移量，每次都从头开始读取)
  //   autoCommit: true,
  //   autoCommitIntervalMs: 5000,
  //   //  如果设置为true，则consumer将从有效负载中的给定偏移量中获取消息
  //   fromOffset: false,
  // };

  // Fetch message config
  const options = {
    // If set true, consumer will fetch message from the given offset in the payloads
    // 翻译： 如果设置为true，则consumer将从在有效负载中的给定偏移量处获取消息
    fromOffset: true,
  };
  const kafkaClient = getKafakaClient();
  kafkaConsumer = new kafka.Consumer(kafkaClient, topics, options);
  kafkaConsumer.on('message', function (message) {
    // console.log('message');
    const value = JSON.parse(message.value as string);
    if (value.event === 'clientLog') {
      console.log('consumer receive message:', message);
    }
  });

  const offset = new kafka.Offset(kafkaClient);
  kafkaConsumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange');
    offset.fetch(topics, (err, offsets) => {
      // 设置了几个分区，就要在收到offsetOutOfRange时，分别在所有分区的有效负载中设置新的偏移量
      const min0 = Math.min.apply(null, offsets[topic]['0']);
      const min1 = Math.min.apply(null, offsets[topic]['1']);
      const min2 = Math.min.apply(null, offsets[topic]['2']);
      console.log('offsets==', offsets, min0);
      kafkaConsumer.setOffset(topic, 0, min0);
      kafkaConsumer.setOffset(topic, 1, min1);
      kafkaConsumer.setOffset(topic, 2, min2);
    });
  });
  return kafkaConsumer;
};
