export class WebResponse<T> {
  status: string;
  message?: string | string[];
  data?: T;
}
