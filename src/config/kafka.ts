import { registerAs } from '@nestjs/config';

export default registerAs('kakfa', () => ({
  broker_username: process.env.KAFKA_BROKER_USERNAME || 'user',
  broker_password: process.env.KAFKA_BROKER_PASSWORD || "password",
}));
