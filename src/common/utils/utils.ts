import { Request } from 'express';

export function getHost(request: Request): string {
  return request.protocol + '://' + request.get('host');
}
