export class IMailConfigDto {
  fromEmail: string = '';
  host: string = '';
  port: number = 0;
  auth: IMailAuth = new IMailAuth(); 
  secure: boolean = false;
  otherProperties: Record<string, any>;
}

export class IMailAuth {
  user: string = '';
  pass: string = '';
}
