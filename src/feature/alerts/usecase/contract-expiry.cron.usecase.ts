import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { ContractAlertsDbRepository } from '../repositories/db/alerts.repository';
import { EmailService } from '../../notification/notification.service';

@Injectable()
export class ContractExpiryCronUsecase {
  private readonly logger = new Logger(ContractExpiryCronUsecase.name);

  constructor(
    private readonly contractAlertsRepo: ContractAlertsDbRepository,
    private readonly emailService: EmailService,
  ) {}

  /**
   * Runs every day at 9 AM (Nepal Time)
   */
  @Cron(CronExpression.EVERY_DAY_AT_9AM, {
    timeZone: 'Asia/Kathmandu',                                                     
  })
  async execute() {
    this.logger.log('Contract expiry cron started');

    // Get alerts with their contracts
    const rows = await this.contractAlertsRepo.findActiveExpiryAlertsWithContract();
    console.log('Fetched alerts for cron:', rows);

    const today = new Date();
    today.setHours(0, 0, 0, 0); // normalize to midnight for date-only comparison

    for (const row of rows) {
      const { alertId, reminderInterval, contractId, title, expiryDate } = row;

      const expiry = new Date(expiryDate);
      expiry.setHours(0, 0, 0, 0); // normalize

      const reminderDays = Number(reminderInterval || 0);
      const reminderDate = new Date(expiry);
      reminderDate.setDate(expiry.getDate() - reminderDays);

      // If today is within reminder period
      if (today >= reminderDate && today <= expiry) {
        await this.emailService.sendEmail({
          emailProperties: {
            to: row.stakeholders, // you need actual stakeholder emails from ContractAlert
            subject: 'Contract Expiry Reminder',
            htmlBody: `
              <p><b>Contract Title: ${title}</b></p>
              <p>Expires on: ${expiryDate.toISOString().split('T')[0]}</p>
              <p>Reminder: ${reminderDays} day(s) before expiry</p>
            `,
          },
        });

        this.logger.log(`Reminder sent for contract ${contractId}`);
      }
    }

    this.logger.log('Contract expiry cron finished');
  }
}
