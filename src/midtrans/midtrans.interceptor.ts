import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

@Injectable()
export class MidtransInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const {
      order_id,
      gross_amount,
      signature_key,
      status_code,
      transaction_status,
      fraud_status,
      payment_type,
    } = request.body;
    request.body = {
      order_id,
      gross_amount,
      signature_key,
      status_code,
      transaction_status,
      fraud_status,
      payment_type,
    };
    return next.handle();
  }
}
