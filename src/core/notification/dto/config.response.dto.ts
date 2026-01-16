export class ConfigResponseDto{
    fromEmail:string;
    host:string;
    port:number;
    authUser:string;
    authPassword:string;
    secure: boolean;
    user: string;
    pass: string;
}

export class SmsConfigResponseDto{
    smsUrl:string;
	token:string;
	from:string;
}