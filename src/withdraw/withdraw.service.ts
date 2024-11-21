import { HttpException, Injectable } from '@nestjs/common';
import { CreateWithdrawDto } from './dto/create-withdraw.dto';
import { UpdateWithdrawDto } from './dto/update-withdraw.dto';
import { PrismaService } from 'src/common/prisma.service';
import { Auth } from 'src/model/user.model';
import { v4 as uuid } from 'uuid';
import { WithdrawHelper } from './helper/helper.service';
import { WithdrawResponse } from './dto/response.dto';
import { UserWithdrawQueryDto } from 'src/admin/dto/get.dto';

@Injectable()
export class WithdrawService {
  constructor(
    private prismaService: PrismaService,
    private withdrawHelper: WithdrawHelper,
  ) { }

  async createWithdraw(user: Auth, payload: CreateWithdrawDto): Promise<WithdrawResponse> {
    const userId = user.id;
    await this.withdrawHelper.checkUserBank(userId, payload.userBankId);
    await this.withdrawHelper.checkUserSaldo(userId, payload.jumlah);
    await this.withdrawHelper.decreaseSaldo(userId, payload.jumlah);
    const withdraw = await this.prismaService.withdraw.create({
      data: {
        id: `withdraw-${uuid().toString()}`,
        userId: userId,
        ...payload,
      },
      select: this.withdrawHelper.withdrawSelectCondition(),
    });
    if (!withdraw) {
      throw new HttpException("Gagal Melakukan Withdraw", 500)
    }
    return this.withdrawHelper.toWithdrawResponse(withdraw);
  }

  async findAllWithdraw(user: Auth): Promise<WithdrawResponse[]> {
    const withdraw = await this.prismaService.withdraw.findMany({
      where: {
        userId: user.id,
      },
      select: this.withdrawHelper.withdrawSelectCondition(),
      orderBy: {
        createdAt: 'desc',
      }
    });
    return withdraw.map((withdraw) => this.withdrawHelper.toWithdrawResponse(withdraw));
  }

  async removeWithdraw(user: Auth, id: string) {
    await this.withdrawHelper.checkWithdrawOwner(user.id, id);
    await this.withdrawHelper.increaseSaldo(user.id);
    await this.prismaService.withdraw.delete({
      where: {
        id: id,
      },
      select: {
        id: true,
      },
    });
  }

  async findWithdrawByQuery(query: UserWithdrawQueryDto): Promise<WithdrawResponse[]> {
    const withdraw = await this.prismaService.withdraw.findMany({
      where: {
        status: query?.status || undefined,
      },
      select: this.withdrawHelper.withdrawSelectCondition(),
      orderBy: {
        createdAt: 'desc',
      }
    });
    return withdraw.map((withdraw) => this.withdrawHelper.toWithdrawResponse(withdraw));
  }

  async acceptWithdraw(withdrawId: string, status: string) {
    const withdraw = await this.prismaService.withdraw.update({
      where: {
        id: withdrawId,
      },
      data: {
        status: status,
      },
      select: {
        id: true,
      },
    });
    if (!withdraw) {
      throw new HttpException("Gagal Approve Withdraw", 500)
    }
  }
}
