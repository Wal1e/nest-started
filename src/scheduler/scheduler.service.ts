import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { EsService } from '@src/es/es.service';
import * as dayjs from 'dayjs';

@Injectable()
export class SchedulerService {
  constructor(private readonly esService: EsService) {}

  @Cron('0 52 14 * * 0-6')
  async handleDeleteEsData() {
    console.log('Called when the current second is 11');
    const before = dayjs().subtract(1, 'days'); // 2022 12 16 21:13:36
    const beforeStart = before.startOf('date').valueOf(); // 2022 12 16 00:00:00
    const beforeEnd = before.endOf('date').valueOf(); // 2022 12 16 23:59:59
    const todayStart = dayjs().startOf('date').valueOf();
    const todayNowByHour = dayjs().startOf('hour').valueOf();
    const today_gte = todayStart;
    const today_lt = todayNowByHour + 60 * 60 * 1000;
    const res = await this.esService.deleteByQuery(
      1671206400000,
      1671292800000,
    );
    console.log('handleDeleteEsData--res=', res);
  }

  // 每30秒打印一次
  // @Cron('30 * * * * *')
  // triggerNotifications() {
  //   console.log('Called when the current second is 10');
  // }
}
