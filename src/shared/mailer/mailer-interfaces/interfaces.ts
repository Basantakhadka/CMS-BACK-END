export interface IMailConfig {
  fromEmail: string;
  host: string;
  port: number;
  auth: IMailAuth;
  secure:boolean
}

interface IMailAuth {
  user: string;
  pass: string;
}

export interface IMailResponse {
  success: boolean;
  message?: string;
  item?: any;
  errors?: any;
}
export interface EmailAttachment {
	fileName: string;
	path: string;
	cid: string;
}
export interface IMessage{
  emailProperties: IMailOptions
}

export interface IMailOptions {
	subject: string;
	templateName?: string;
	body?: string;
	htmlBody?: string;
	replace?: Record<string, any>;
	to?: string | Array<string>;
	attachments?: EmailAttachment[];
}
