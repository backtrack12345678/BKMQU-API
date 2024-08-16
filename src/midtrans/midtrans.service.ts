import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AxiosService } from '../common/axios/axios.service';
import { Auth } from '../model/user.model';
import { PrismaService } from '../common/prisma.service';
import { AxiosResponse } from 'axios';
import { v4 as uuid } from 'uuid';
import { Snap } from 'midtrans-client';
import * as crypto from 'crypto';
import { UpdateWebhookDto } from './dto/update-midtrans.dto';

@Injectable()
export class MidtransService {
  constructor(
    private axiosService: AxiosService,
    private prismaService: PrismaService,
  ) { }

  public snap = new Snap({
    isProduction: false,
    serverKey: process.env.MIDTRANS_SERVER_KEY,
    clientKey: process.env.MIDTRANS_CLIENT_KEY,
  });

  async validateOrderId(senderId: string, orderId: string) {
    const midtransTransactions =
      await this.prismaService.midtrans_Transactions.findUnique({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          userInfaq: {
            select: {
              userId: true,
            },
          },
          userSedekah: {
            select: {
              userId: true,
            },
          },
        },
      });

    if (!midtransTransactions) {
      throw new NotFoundException('Order id tidak ditemukan');
    }

    if (
      senderId !==
      (midtransTransactions.userInfaq?.userId ||
        midtransTransactions.userSedekah?.userId)
    ) {
      throw new HttpException('Anda tidak berhak mengakses transaksi ini', 403);
    }
    return midtransTransactions;
  }

  async validateUserId(userId) {
    const user = await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
      },
    });
    if (!user) {
      throw new NotFoundException('User tidak ditemukan');
    }
  }

  async createSnap(orderId, amount) {
    const transaction = await this.snap.createTransaction({
      transaction_details: {
        order_id: orderId,
        gross_amount: amount,
      },
    });

    if (!transaction.redirect_url) {
      throw new HttpException('Gagal membuat transaksi', 500);
    }
    return transaction;
  }

  async createTransactiontoDb(orderId, categoryId, payload) {
    const transaction = await this.createSnap(orderId, payload.amount);
    const midtransTransaction =
      await this.prismaService.midtrans_Transactions.create({
        data: {
          id: orderId,
          amount: payload.amount,
          recipientId: payload.recipientId,
          redirectUrl: transaction.redirect_url,
          categoryId,
        },
      });

    return midtransTransaction;
  }

  verifySignature(payload: UpdateWebhookDto) {
    const hash = crypto
      .createHash('sha512')
      .update(
        payload.order_id +
        payload.status_code +
        payload.gross_amount +
        process.env.MIDTRANS_SERVER_KEY,
      )
      .digest('hex');
    if (hash !== payload.signature_key) {
      throw new HttpException('Fraud Transaction', 401);
    }
    // return {
    //   status_code: payload.status_code,
    //   transaction_status: payload.transaction_status,
    //   fraud_status: payload.fraud_status,
    // };
  }

  async getPaymentData(orderId: string) {
    const midtransTransaction =
      await this.prismaService.midtrans_Transactions.findUnique({
        where: {
          id: orderId,
        },
        select: {
          id: true,
          amount: true,
          recipientId: true,
          isInserted: true,
          category: {
            select: {
              nama: true,
            },
          },
          userInfaq: {
            select: {
              userId: true,
              infaqTarget: true,
            },
          },
          userSedekah: {
            select: {
              userId: true,
            },
          },
        },
      });
    if (!midtransTransaction) {
      throw new NotFoundException('Data transaksi tidak ditemukan');
    }
    if (midtransTransaction.isInserted === true) {
      throw new BadRequestException('Transaksi sudah berhasil');
    }
    return {
      id: midtransTransaction.id,
      amount: midtransTransaction.amount,
      recipientId: midtransTransaction.recipientId,
      senderId:
        midtransTransaction.userInfaq?.userId ||
        midtransTransaction.userSedekah?.userId ||
        '',
      category: midtransTransaction.category.nama,
      infaqId: midtransTransaction.userInfaq?.infaqTarget?.infaqId || '',
    };
  }

  calculateFeePayment(paymentType: string, grossAmount: number): number {
    const feeList = {
      qris: grossAmount * (7 / 1000),
      akulaku: grossAmount * (17 / 1000),
      credit_card: grossAmount * (29 / 1000) + 2000,
      bank_transfer: 4000,
      echannel: 4000,
      cstore: 5000,
    };
    const fee: number = feeList[paymentType] || grossAmount * (2 / 100);
    return Math.floor(grossAmount - (fee + fee * (11 / 100)));
  }

  async addSaldo(paymentData, netAmount: number) {
    const result = await this.prismaService.midtrans_Transactions.update({
      where: {
        id: paymentData.id,
        recipientId: paymentData.recipientId,
      },
      data: {
        isInserted: true,
        netAmount,
        recipient: {
          update: {
            detailUser: {
              update: {
                saldo: {
                  increment: netAmount,
                },
              },
            },
          },
        },
      },
      select: {
        id: true,
      },
    });
    if (!result) {
      throw new BadRequestException('Gagal memperbarui status transaksi');
    }
    return result;
  }

  async createTransaksiMesjid(paymentData) {
    const transaksiMesjid = await this.prismaService.transaksi_Mesjid.create({
      data: {
        mesjidUserId: paymentData.recipientId,
        midtransId: paymentData.id,
      },
    });
    if (!transaksiMesjid) {
      throw new BadRequestException('Transaksi Mesjid gagal dibuat');
    }
    return transaksiMesjid;
  }

  async addInfaqSaldoMasuk(paymentData, netAmount: number) {
    const infaq = await this.prismaService.infaq.update({
      where: {
        id: paymentData.infaqId,
        mesjidUserId: paymentData.recipientId,
      },
      data: {
        saldoMasuk: {
          increment: netAmount,
        },
      },
    });
    if (!infaq) {
      throw new BadRequestException('saldo gagal diupdate');
    }
    return infaq;
  }

  async pushNotification(paymentData) {
    const notificationData = await this.getNotificationData(paymentData);
    if (notificationData.length > 0) {
      await this.axiosService.notificationInstance.post(
        '--/api/v2/push/send',
        notificationData,
      );
    }
  }

  async getNotificationData(paymentData) {
    const tokens = await this.prismaService.refresh_Token.findMany({
      where: {
        userId: {
          in: [paymentData.recipientId, paymentData.senderId],
        },
      },
      select: {
        notificationToken: true,
      },
    });
    return tokens
      .map((token, index) => {
        if (token.notificationToken) {
          return {
            to: token.notificationToken,
            title:
              index === 0
                ? `Transaksi ${paymentData.category} Berhasil`
                : `Dana ${paymentData.category} Masuk!`,
            body: `${paymentData.category} sebesar Rp. ${paymentData.amount} berhasil !`,
            priority: 'default',
          };
        }
        return null;
      })
      .filter((notification) => notification !== null);
  }

  async createMidtransTransaction(categoryId, payload) {
    const orderId = `payment-${uuid()}`;
    await this.validateUserId(payload.recipientId);
    return this.createTransactiontoDb(orderId, categoryId, payload);
  }

  async deleteMidtransTransaction(orderId: string): Promise<void> {
    const result = await this.prismaService.midtrans_Transactions.delete({
      where: {
        id: orderId,
        isInserted: false,
      },
      select: {
        id: true,
      },
    });
    if (!result) {
      throw new NotFoundException('Transaksi tidak ditemukan');
    }
  }

  async getDetailTransaction(user: Auth, orderId: string) {
    const senderId = user.id;
    await this.validateOrderId(senderId, orderId);

    const result: AxiosResponse = await this.axiosService.midtransInstance.get(
      `v2/${orderId}/status`,
    );
    if (!result.data.order_id) {
      throw new NotFoundException('Detail transaksi tidak ditemukan');
    }
    return {
      id: result.data.order_id,
      status: result.data.transaction_status,
      amount: parseInt(result.data.gross_amount),
      currency: result.data.currency,
      paymentType: result.data.payment_type,
      createdAt: result.data.transaction_time,
      expiryTime: result.data.expiry_time,
    };
  }

  async cancelTransaction(user: Auth, orderId: string) {
    const senderId = user.id;
    await this.validateOrderId(senderId, orderId);

    const result = await this.axiosService.midtransInstance.get(
      `v2/${orderId}/status`,
    );

    if (result.data.status_message === "Transaction doesn't exist.") {
      await this.deleteMidtransTransaction(orderId);
      return 'Transaksi Berhasil Dihapus';
    }
    return 'success';
  }

  async updateSaldoWebhook(payload: UpdateWebhookDto) {
    this.verifySignature(payload);
    const paymentData = await this.getPaymentData(payload.order_id);
    const role: string = paymentData.recipientId.split('-')[0];
    const netAmount = this.calculateFeePayment(
      payload.payment_type,
      Number(payload.gross_amount),
    );
    await this.addSaldo(paymentData, netAmount);
    if (role === 'mesjid') {
      await this.createTransaksiMesjid(paymentData);
    }
    if (paymentData.category === 'Infaq Target') {
      await this.addInfaqSaldoMasuk(paymentData, netAmount);
    }
    await this.pushNotification(paymentData);
  }

  async verifyBankAccount(payload) {
    // const result = await this.axiosService.irisInstance.get(`api/v1/account_validation?bank=${BANK_NAME}&account=${BANK_ACCOUNT}`);
    try {
      const result = await this.axiosService.irisInstance.get(`api/v1/account_validation?bank=mandiri&account=1070019946575`);
      console.log(result);
    } catch (e) {
      console.log(e.response);
      throw new HttpException(e.message, 400);
    }
  }
}
