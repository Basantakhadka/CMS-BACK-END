import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContractDbRepository } from '../repositories/db/contact.respository';

@Injectable()
export class ContractAutoRenewCronUsecase {
  private readonly logger = new Logger(ContractAutoRenewCronUsecase.name);

  constructor(
    @Inject(ContractDbRepository)
    private readonly contractRepo: ContractDbRepository,
  ) {}

  /**
   * Runs every day at midnight Nepal time
   */
  @Cron(CronExpression.EVERY_12_HOURS, {
    timeZone: 'Asia/Kathmandu',
  })
  async execute() {
    const start = Date.now();
    this.logger.log('Auto-renew cron started');

    try {
      const renewedCount =
        await this.contractRepo.autoRenewContracts();

      this.logger.log(
        `Auto-renew completed. Renewed contracts = ${renewedCount}`,
      );
    } catch (error) {
      this.logger.error('Auto-renew cron failed', error);
    }

    const duration = Date.now() - start;
    this.logger.log(`Auto-renew cron finished in ${duration}ms`);
  }
}