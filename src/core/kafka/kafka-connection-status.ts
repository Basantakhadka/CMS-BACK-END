export enum KafkaConnectionStatus {
  CONNECTED = 'Connected',
  DISCONNECTED = 'Disconnected',
  CRASHED = 'Crashed',
  REQUEST = 'Requested',
  REQUEST_QUEUE_SIZE = 'Request queue size',
  REQUEST_TIMEOUT = 'Request timeout'
}