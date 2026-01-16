import { EnumType } from "./enum-type.constant";

export class EmailTopicType extends EnumType<EmailTopicType>{
    public static readonly SEND_EMAIL = new EmailTopicType('SEND_EMAIL', 'send_email','email-group');

    constructor(public readonly name:string, public readonly topic:string,public readonly groupId:string){
        super(name);
        this.topic = `${process.env.DEPLOYMENT_NAMESPACE}_${topic}`;
        this.groupId = `${process.env.DEPLOYMENT_NAMESPACE}_${groupId}`;
    }

    public static getValues():EmailTopicType[]{
        return[
            this.SEND_EMAIL,
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
