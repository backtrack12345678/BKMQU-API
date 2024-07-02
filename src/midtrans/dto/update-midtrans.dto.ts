import { IsString, IsIn, IsNotEmpty } from 'class-validator';
export class UpdateWebhookDto {
  @IsNotEmpty()
  @IsString()
  order_id: string;

  @IsNotEmpty()
  @IsString()
  gross_amount: string;

  @IsNotEmpty()
  @IsString()
  signature_key: string;

  @IsString()
  @IsIn(['200', '201', '202'])
  @IsNotEmpty()
  status_code: string;

  @IsString()
  @IsIn(['settlement', 'capture'])
  @IsNotEmpty()
  transaction_status: string;

  @IsString()
  @IsIn(['accept'])
  @IsNotEmpty()
  fraud_status: string;

  @IsString()
  @IsNotEmpty()
  payment_type: string;
}
