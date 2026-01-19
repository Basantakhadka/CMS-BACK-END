export class ErrorDetail {
  //String code, String message, String source, String detai
  code: string;
  message: string;
  source: string;
  detail: string;

  constructor(code: string, message: string) {
    this.code = code;
    this.message = message;
  }
}
