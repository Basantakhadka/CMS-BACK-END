export interface SmsProperties {
	to: string;
	message: string;
	institutionCode?: string;
}


export interface SmsConfig{
	smsUrl:string,
	config:object
}
