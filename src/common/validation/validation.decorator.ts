import { applyDecorators, UsePipes } from '@nestjs/common';
import { ZodType } from 'zod';
import { ZodValidationPipe } from './validation.pipe';

export function Validation(schema: ZodType) {
  return applyDecorators(UsePipes(new ZodValidationPipe(schema)));
}
