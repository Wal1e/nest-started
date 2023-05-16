import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { getKafkaConsumer } from './kafka-utils';
// import { getKafkaConsumerGroup } from './consumer.group';
import { getKafkaConsumerGroup } from './kafkaJs';
import { EsModule } from '../es/es.module';
import { EsService } from '@src/es/es.service';

@Module({
  imports: [EsModule],
})
export class KafkaConsumerModule implements OnApplicationBootstrap {
  constructor(private readonly esService: EsService) {
    console.log('Inject EsService');
  }

  async handleListenerKafkaMessage() {
    console.log('handleListenerKafkaMessage');
    const kafkaConsumer = await getKafkaConsumerGroup();
    kafkaConsumer.on('consumer.fetch', async (data) => {
      console.log('consumer.fetch==', data);
    });
  }
  async onApplicationBootstrap() {
    this.handleListenerKafkaMessage();
  }
  onModuleInit() {
    console.log('OnModuleInit');
  }
}
