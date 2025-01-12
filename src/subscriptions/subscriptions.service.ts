import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
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

const RATE_FEE: number = 0.11;

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

  async getAllSubscriptions(user: Auth, param) {
    if (user.role !== 'admin') {
      if (param.jenis !== 'semua') {
        if (param.jenis !== user.role) {
          throw new HttpException(
            'Tidak Dapat Melihat Paket Langganan Ini',
            403,
          );
        }
      }
    }

    const subscriptions = await this.prismaService.langganan.findMany({
      where: {
        jenis: param.jenis || undefined,
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

    return subscriptions;
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

  async getUserSubscription(userId: string, type?: string) {
    const userSubscriptions = await this.prismaService.langganan_User.findFirst(
      {
        where: {
          userId,
          ...(type && {
            langganan: {
              jenis: type,
            },
          }),
        },
        select: {
          id: true,
          langganan: {
            select: {
              id: true,
              nama: true,
              jenis: true,
              harga: true,
            },
          },
          mulai: true,
          selesai: true,
        },
      },
    );

    return userSubscriptions;
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
        langganan: {
          jenis: subscription.jenis,
        },
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
          midtrans: {
            isInserted: false,
          },
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

    const netPrice = this.calculateSubscriptionNetPrice(
      subscription.harga,
      payload.durasi,
    );

    const snap = await this.midtransService.createAdminMitransTransaction(
      7,
      netPrice,
    );

    const historySubscription = await this.createHistorySubscription(
      user.id,
      snap.id,
      param.subscriptionId,
      payload,
      'beli',
    );

    return {
      id: snap.id,
      amount: snap.amount,
      redirectUrl: snap.redirectUrl,
      createdAt: historySubscription.createdAt,
      updatedAt: historySubscription.updatedAt,
    };
  }

  async upgradeSubscriptionTransaction(user: Auth, payload, param) {
    const subscription = await this.findOneSubsciption(
      param.subscriptionId,
      param.jenis,
    );

    if (subscription.jenis !== 'semua') {
      if (subscription.jenis !== user.role) {
        throw new HttpException('Tidak Dapat Membeli Paket Langganan Ini', 403);
      }
    }

    const userSubscription = await this.getUserSubscription(
      user.id,
      subscription.jenis,
    );

    if (!userSubscription || userSubscription.selesai < new Date()) {
      throw new NotFoundException(
        'Kamu Belum Berlangganan, Tidak Bisa Meningkatkan',
      );
    }

    // cek langganan harus lebih tinggi atau sama
    if (subscription.harga < userSubscription.langganan.harga) {
      throw new BadRequestException(
        'Tidak Bisa Meningkatkan Paket Langganan Ke Yang Lebih Rendah',
      );
    }

    await this.checkSubscriptionHistoryTransaction(
      user.id,
      param.subscriptionId,
    );
    const netPrice = this.calculateSubscriptionNetPrice(
      subscription.harga,
      payload.durasi,
    );
    const snap = await this.midtransService.createAdminMitransTransaction(
      7,
      netPrice,
    );
    const historySubscription = await this.createHistorySubscription(
      user.id,
      snap.id,
      param.subscriptionId,
      payload,
      'upgrade',
    );

    return {
      id: snap.id,
      amount: snap.amount,
      redirectUrl: snap.redirectUrl,
      createdAt: historySubscription.createdAt,
      updatedAt: historySubscription.updatedAt,
    };
  }

  async mesjidSubscriptions() {}

  async checkSubscriptionHistoryTransaction(
    userId: string,
    subscriptionId: number,
  ) {
    const historyTransaction =
      await this.prismaService.riwayat_Langganan.findFirst({
        where: {
          userId: userId,
          langgananId: subscriptionId,
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
  }

  calculateSubscriptionNetPrice(harga: number, durasi: number): number {
    const totalPrice = harga * durasi;
    const fee = totalPrice * RATE_FEE;
    return totalPrice + fee;
  }

  async createHistorySubscription(
    userId: string,
    snapId: string,
    subscriptionId: number,
    payload,
    jenis: string,
  ) {
    return this.prismaService.riwayat_Langganan.create({
      data: {
        userId,
        midtransId: snapId,
        langgananId: subscriptionId,
        jenis,
        ...payload,
      },
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async getHistoryTransactionSubscription(user: Auth, query?) {
    const historyTransaction =
      await this.prismaService.riwayat_Langganan.findMany({
        where: {
          userId: user.id,
          ...(query?.jenis && {
            langganan: {
              jenis: query?.jenis,
            },
          }),
        },
        orderBy: [
          {
            midtrans: {
              isInserted: 'asc',
            },
          },
          {
            createdAt: 'desc',
          },
        ],
        select: {
          userId: true,
          durasi: true,
          midtrans: {
            select: {
              id: true,
              amount: true,
              redirectUrl: true,
              isInserted: true,
            },
          },
          langganan: {
            select: {
              id: true,
              nama: true,
              jenis: true,
              harga: true,
            },
          },
        },
      });

    return historyTransaction.map((ht) => ({
      id: ht.midtrans.id,
      userId: ht.userId,
      status: ht.midtrans.isInserted ? 'sudah dibayar' : 'belum dibayar',
      langganan: {
        ...ht.langganan,
      },
      durasi: ht.durasi,
      hargaNet: ht.midtrans.amount,
      url: ht.midtrans.redirectUrl,
    }));
  }
}
