import { Logger } from "@nestjs/common";

export function logProducerRequestMessage(topic: string, message: any) {
    Logger.log(`Producer requested to produce message for topic ${ topic}:`, message);
}

export function logProducerRequestFailedMessage(topic: string, error: any) {
    console.error(`Producer requested to produce message for topic ${ topic } failed:`, error);
}

export function logProducedMessageProcess(topic: string, message: any) {
    Logger.log(`Producing message to topic: ${topic} `, message);
}

export function logProducedMessageSuccess(metaData: string) {
    Logger.log(`Successfully produced message: \n ${ metaData}`);
}

export function logProducedMessageFailed(topic: string, error: any) {
    console.error(`Failed to produce message in topic: ${topic}`, error);
}

export function logConnectAndSubscribeConsumerFailed(error: any) {
    console.error(`Failed to connect and subscribe consumer to brooker`, error);
}

export function logConsumedMessageSuccess(groupId: string, message: any) {
    Logger.log(`Successfully consumed message by group: ${ groupId }`, message);
}

export function logConsumedMessageProcessingSuccess(groupId: string, message: any) {
    Logger.log(`Successfully consumed and processed message by group: ${groupId}`, message);
}

export function logConsumedMessageFailed(groupId: string, error: any) {
    console.error(`Failed to consume message by group: ${ groupId }`, error);
}

export function logProducedMessageMetadataSuccess(metaData: string) {
    Logger.log(`Produced message metadata: \n ${ metaData }`);
}