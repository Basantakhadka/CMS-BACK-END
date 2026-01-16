import { Injectable, Logger } from "@nestjs/common";
import axios from "axios";
import { SmsProperties } from "../notification/sms-properties.interface";

@Injectable()
export class SparrowSmsService {
  async sendSms(smsProperties: SmsProperties, smsConfig: any) {
    const { smsUrl } = smsConfig;
    const method = smsConfig.method;

    const payload = this.prepareFinalPayload(
      smsConfig,
      smsProperties.to,
      smsProperties.message,
      method
    );

    try {
      if (method && method.toLowerCase() === "get") {
        await axios.get(`${smsUrl}?${payload}`);
        Logger.debug(`Successfully sent sms to ${smsProperties.to}`);
        return;
      }
      await axios.post(smsUrl, payload);
      Logger.debug(`Successfully sent sms to ${smsProperties.to}`);
    } catch (err) {
      Logger.error("SPARROW SMS ERROR", err.response?.data);
    }
  }
  private prepareFinalPayload(
    config: any,
    to: string,
    message: string,
    method: string
  ) {
    const newPayload = { ...config.payload };
    let queryParam = "";

    if (method && method.toLowerCase() === "get") {
      Object.keys(newPayload).forEach((element, index, array) => {
        if(newPayload[element] === "$replaceTo") {
          queryParam += `${element}=${to}`;
        }
        if (newPayload[element] === "977$replaceTo") {
          queryParam += `${element}=977${to}`;
        }
        if (newPayload[element] === "$replaceMessage") {
          queryParam += `${element}=${encodeURIComponent(message)}`;
        }

        if (
          newPayload[element] !== "$replaceMessage" &&
          newPayload[element] !== "977$replaceTo" &&
          newPayload[element] !== "$replaceTo"
        ) {
          queryParam += `${element}=${newPayload[element]}`;
        }
        // Add "&" only if it's not the last element in the array
        if (index < array.length - 1) {
          queryParam += "&";
        }
      });
      return queryParam;
    }
    Object.keys(newPayload).forEach((element) => {
      if (newPayload[element] === "$replaceTo") {
        newPayload[element] = to;
      }
      if (newPayload[element] === "$replaceMessage") {
        newPayload[element] = message;
      }
    });
    return newPayload;
  }
}
