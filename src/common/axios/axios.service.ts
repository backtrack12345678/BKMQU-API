import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Axios from 'axios';

@Injectable()
export class AxiosService {
  constructor(private configService: ConfigService) {}
  public midtransInstance = Axios.create({
    baseURL: this.configService.get<string>('MIDTRANS_BASE_URL'),
    timeout: 10000,
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
    },
  });

  public irisInstance = Axios.create({
    baseURL: this.configService.get<string>('IRIS_BASE_URL'),
    timeout: 10000,
    headers: {
      Authorization: `Basic ${Buffer.from(`${process.env.MIDTRANS_SERVER_KEY}:`).toString('base64')}`,
    },
  });

  public notificationInstance = Axios.create({
    baseURL: this.configService.get<string>('EXPO_NOTIFICATION_BASE_URL'),
  });
}
