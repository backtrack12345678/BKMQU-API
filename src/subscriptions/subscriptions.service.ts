import { BadRequestException, HttpException, Injectable } from '@nestjs/common';
import {
  CreateSubscriptionDto,
  SubscriptionsTransactionDto,
} from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { Auth } from '../model/user.model';
import { MidtransService } from '../midtrans/midtrans.service';
import { PrismaService } from '../common/prisma.service';
import { SubscriptionResponse } from './dto/response.dto';
import { SubscriptionsTransactionParamDto } from './dto/params.dto';

@Injectable()
export class SubscriptionsService {
  constructor(
    private midtransService: MidtransService,
    private prismaService: PrismaService,
  ) {}

  async createSubscription(
    payload: CreateSubscriptionDto,
  ): Promise<SubscriptionResponse> {
    const subscription = await this.prismaService.langganan.create({
      data: payload,
      select: {
        id: true,
        nama: true,
        harga: true,
        jenis: true,
        deskripsi: true,
        createdAt: true,
      },
    });

    return subscription;
  }

  findAll() {
    return `This action returns all subscriptions`;
  }

  findOne(id: number) {
    return `This action returns a #${id} subscription`;
  }

  update(id: number, updateSubscriptionDto: UpdateSubscriptionDto) {
    return `This action updates a #${id} subscription`;
  }

  remove(id: number) {
    return `This action removes a #${id} subscription`;
  }

  async findOneSubsciption(subscriptionId: number, jenis: string) {
    const subscription = await this.prismaService.langganan.findUnique({
      where: {
        id: subscriptionId,
        jenis,
      },
      select: {
        id: true,
        nama: true,
        harga: true,
        jenis: true,
        deskripsi: true,
        createdAt: true,
      },
    });

    if (!subscription) {
      throw new HttpException('Paket Langganan Tidak Ditemukan', 404);
    }

    return subscription;
  }

  async createSubscriptionTransaction(
    user: Auth,
    payload: SubscriptionsTransactionDto,
    param: SubscriptionsTransactionParamDto,
  ) {
    const subscription = await this.findOneSubsciption(
      param.subscriptionId,
      param.jenis,
    );
    //cek tidak boleh ada langganan, atau kalaupun ada tidak boleh aktif
    const userSubscription = await this.prismaService.langganan_User.findFirst({
      where: {
        userId: user.id,
        langgananId: param.subscriptionId,
      },
      select: {
        id: true,
        selesai: true,
      },
    });

    if (userSubscription && new Date() < userSubscription.selesai) {
      throw new BadRequestException(
        'Langganan Masih Aktif Tidak Dapat Membuat Yang Baru, Silahkan Ke Menu Upgrade',
      );
    }
    //cek jika transaksi terakhir pending tidak bisa buat yang baru
    const historyTransaction =
      await this.prismaService.riwayat_Langganan.findFirst({
        where: {
          userId: user.id,
          langgananId: param.subscriptionId,
        },
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          midtrans: {
            select: {
              isInserted: true,
            },
          },
        },
      });

    if (historyTransaction && !historyTransaction.midtrans.isInserted) {
      throw new BadRequestException(
        'Transaksi Yang Lama Masih Ada Silahkan Hapus Atau Selesaikan Terlebih Dahulu',
      );
    }

    if (subscription.jenis !== 'semua') {
      if (subscription.jenis !== user.role) {
        throw new HttpException('Tidak Dapat Membeli Paket Langganan Ini', 403);
      }
    }

    const amount = subscription.harga * payload.durasi;
    const snap = await this.midtransService.createAdminMitransTransaction(
      7,
      amount,
    );
    const historySubscriptions =
      await this.prismaService.riwayat_Langganan.create({
        data: {
          userId: user.id,
          midtransId: snap.id,
          langgananId: subscription.id,
          ...payload,
        },
        select: {
          id: true,
          createdAt: true,
          updatedAt: true,
        },
      });

    return {
      id: snap.id,
      amount: snap.amount,
      redirectUrl: snap.redirectUrl,
      createdAt: historySubscriptions.createdAt,
      updatedAt: historySubscriptions.updatedAt,
    };
  }

  async mesjidSubscriptions() {}
}
