import { HttpException, Injectable } from '@nestjs/common';
import { AxiosService } from '../axios/axios.service';
import { title } from 'process';

@Injectable()
export class NotificationService {
  constructor(private axiosService: AxiosService) {}

  async aktivitas(jamaahNotifToken: string[], options) {
    const jumlahJamaah = jamaahNotifToken.length;
    const batchSize = 100;
    const requestCount = Math.ceil(jumlahJamaah / batchSize);

    try {
      for (let i = 0; i < requestCount; i++) {
        const batch = jamaahNotifToken.slice(i * batchSize, (i + 1) * batchSize);
        const tes = await this.axiosService.notificationInstance.post('--/api/v2/push/send', [
          {
            to: batch, // Menggunakan batch yang benar
            title: `${options.mesjid} Membuat Aktivitas Baru`,
            body: 'Ketuk Untuk Melihat',
            priority: 'default',
            data: {
              id: options.aktivitasId // aktivitas id
            }
          }
        ]);
        
      }
    } catch (e) {
      console.log(e);
      throw new HttpException('Gagal Mengirim Notifikasi', 500);
    }
  }
}
