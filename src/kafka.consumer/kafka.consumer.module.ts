import { Module, OnApplicationBootstrap, OnModuleInit } from '@nestjs/common';
import { getKafkaConsumer } from './kafka-utils';
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
    const kafkaConsumer = getKafkaConsumer();
    kafkaConsumer.on('message', async (message) => {
      console.log('message==', message);
    });
    // 业务逻辑
    this.esService;
  }
  async onApplicationBootstrap() {
    this.handleListenerKafkaMessage();
  }
  onModuleInit() {
    console.log('OnModuleInit');
  }
}
