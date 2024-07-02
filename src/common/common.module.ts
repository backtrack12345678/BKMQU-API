import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaService } from './prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { AuthGuard } from './auth.guard';
import { ValidationService } from './validation.service';
import { ErrorFilter } from './error.filter';
import { Token } from './token/token';
import { MulterModule } from '@nestjs/platform-express';
import { RoleGuard } from './role/role.guard';
import { FilesModule } from '../files/files.module';
import { AxiosService } from './axios/axios.service';

export const AXIOS_INSTANCE_TOKEN = 'AXIOS_INSTANCE_TOKEN';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    JwtModule.register({
      global: true,
    }),
    MulterModule.register(),
    FilesModule,
  ],
  providers: [
    PrismaService,
    ValidationService,
    AxiosService,
    {
      provide: 'APP_GUARD',
      useClass: AuthGuard,
    },
    {
      provide: 'APP_GUARD',
      useClass: RoleGuard,
    },
    {
      provide: 'APP_FILTER',
      useClass: ErrorFilter,
    },
    Token,
  ],
  exports: [PrismaService, ValidationService, Token, AxiosService],
})
export class CommonModule {}
