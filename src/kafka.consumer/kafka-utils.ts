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
  const topic_foo = kafkaConfig.topic.foo;
  const topic_boo = kafkaConfig.topic.boo;
  // 设置了几个分区，就要在收到offsetOutOfRange时，分别在所有分区的有效负载中设置新的偏移量
  const topics = [
    { topic: topic_foo, partition: 0 },
    { topic: topic_foo, partition: 1 },
    { topic: topic_foo, partition: 2 },
    { topic: topic_boo, partition: 0 },
    { topic: topic_boo, partition: 1 },
    { topic: topic_boo, partition: 2 },
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
  });

  const offset = new kafka.Offset(kafkaClient);
  kafkaConsumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange');
    offset.fetch(topics, (err, offsets) => {
      // 设置了几个分区，就要在收到offsetOutOfRange时，分别在所有分区的有效负载中设置新的偏移量
      const topic_foo_min0 = Math.min.apply(null, offsets[topic_foo]['0']);
      const topic_foo_min1 = Math.min.apply(null, offsets[topic_foo]['1']);
      const topic_foo_min2 = Math.min.apply(null, offsets[topic_foo]['2']);
      console.log('offsets==', offsets, topic_foo_min0);
      kafkaConsumer.setOffset(topic_foo, 0, topic_foo_min0);
      kafkaConsumer.setOffset(topic_foo, 1, topic_foo_min1);
      kafkaConsumer.setOffset(topic_foo, 2, topic_foo_min2);

      const topic_boo_min0 = Math.min.apply(null, offsets[topic_boo]['0']);
      const topic_boo_min1 = Math.min.apply(null, offsets[topic_boo]['1']);
      const topic_boo_min2 = Math.min.apply(null, offsets[topic_boo]['2']);
      console.log('offsets==', offsets, topic_boo_min0);
      kafkaConsumer.setOffset(topic_boo, 0, topic_boo_min0);
      kafkaConsumer.setOffset(topic_boo, 1, topic_boo_min1);
      kafkaConsumer.setOffset(topic_boo, 2, topic_boo_min2);
    });
  });
  return kafkaConsumer;
};
