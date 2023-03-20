import * as kafka from 'kafka-node';
import { getKafkaConfig } from 'config/env';

const kafkaConfig = getKafkaConfig();

let consumer!: kafka.ConsumerGroup;
const topic_foo = kafkaConfig.topic.foo;
const topic_boo = kafkaConfig.topic.boo;

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

  const kafkaClient = getKafakaClient();

  const offset = new kafka.Offset(kafkaClient);
  const offsets = await getLatestOffsets(offset);
  console.log('latestOffsets', offsets);
  const topics_offset = topics.map((val) => {
    const min = offsets[val.topic][val.partition];
    return { ...val, offset: min };
  });

  const consumerGoupOptions = {
    kafkaHost: kafkaConfig.kafkaHost,
    groupId: 'pans-qa-consumer',
    sessionTimeout: 15000,
    protocol: ['roundrobin'],
    fromOffset: 'earliest', // equivalent of auto.offset.reset valid values are 'none', 'latest', 'earliest'
  } as any;
  consumer = new kafka.ConsumerGroup(
    Object.assign({ id: 'consumer1' }, consumerGoupOptions),
    topic_foo,
  );
  consumer.on('message', function (message) {
    const value = JSON.parse(message.value as string);
    if (value.event === 'clientLog' || message.topic === topic_boo) {
      console.log('message ', value.reportTime);
    }
    if (value.event === 'bzmp-s-jserror') {
      console.log('message-bzmp-s-jserror ', value.reportTime);
    }
  });

  const payloads = topics.map((ele) => {
    return {
      ...ele,
      // Used to ask for all messages before a certain time (ms), default Date.now(),
      // Specify -1 to receive the latest offsets and -2 to receive the earliest available offset.
      time: -1,
    };
  });
  // 添加节流throttleFalg, 防止多次重复设置offset
  let throttleFlag = false;
  consumer.on('offsetOutOfRange', function (err) {
    console.log('offsetOutOfRange');
    if (!throttleFlag) {
      offset.fetch(payloads, (err, offsets) => {
        // 设置了几个分区，就要在收到offsetOutOfRange时，分别在所有分区的有效负载中设置新的偏移量
        const topic_foo_min0 = Math.min.apply(null, offsets[topic_foo]['0']);
        const topic_foo_min1 = Math.min.apply(null, offsets[topic_foo]['1']);
        const topic_foo_min2 = Math.min.apply(null, offsets[topic_foo]['2']);
        console.log('offsets==', offsets, topic_foo_min0);
        consumer.setOffset(topic_foo, 0, topic_foo_min0);
        consumer.setOffset(topic_foo, 1, topic_foo_min1);
        consumer.setOffset(topic_foo, 2, topic_foo_min2);

        const topic_boo_min0 = Math.min.apply(null, offsets[topic_boo]['0']);
        const topic_boo_min1 = Math.min.apply(null, offsets[topic_boo]['1']);
        const topic_boo_min2 = Math.min.apply(null, offsets[topic_boo]['2']);
        console.log('offsets==', offsets, topic_boo_min0);
        consumer.setOffset(topic_boo, 0, topic_boo_min0);
        consumer.setOffset(topic_boo, 1, topic_boo_min1);
        consumer.setOffset(topic_boo, 2, topic_boo_min2);
      });
      throttleFlag = true;
      setTimeout(() => {
        throttleFlag = false;
      }, 1000);
    }
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
