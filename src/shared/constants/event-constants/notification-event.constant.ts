import { EnumType } from "../enum-type.constant";

export class NotificationEventType extends EnumType<NotificationEventType>{
    public static readonly SEND_EMAIL = new NotificationEventType('SEND_EMAIL', 'send-email', 'email-group');
    public static readonly RESET_PASSWORD_SEND_EMAIL = new NotificationEventType('RESET_PASSWORD_SEND_EMAIL', 'reset-password-send-email', 'email-group');
    public static readonly OTP_REGISTER = new NotificationEventType('OTP_REGISTER', 'otp-register', 'otp-group');
    public static readonly OTP_VERIFY = new NotificationEventType('OTP_REGISTER', 'otp-verify', 'otp-group');

    constructor(public readonly name:string, public readonly topicName:string, public readonly groupId:string){
        super(name);
        this.topicName = `${ process.env.DEPLOYMENT_NAMESPACE }-ins-${ topicName }`;
        this.groupId = `${ process.env.DEPLOYMENT_NAMESPACE }-ins-${ groupId }`;
    }

    public static getValues():NotificationEventType[]{
        return[
            this.SEND_EMAIL,
            this.OTP_REGISTER,
            this.OTP_VERIFY
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }

}