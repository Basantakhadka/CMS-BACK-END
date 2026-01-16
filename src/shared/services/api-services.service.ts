import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as https from 'https';
import {
    SettlementPartiesDbRepository
} from "@app/feature/merchants-onboarding/repositories/db/settlement-parties.repository";
import {
    SettlementPartiesRepository
} from "@app/feature/merchants-onboarding/repositories/settlement-parties.repository";
import { IntegrationDetailsDto } from "@app/feature/merchants-onboarding/dtos/integration-details.dto";
import AppLogger from "CMS-BACK-END/src/core/logger/AppLogger";

@Injectable()
export class ApiServices {

    constructor(
        @Inject(AppLogger) private readonly appLogger: AppLogger,
        @Inject(SettlementPartiesDbRepository) private readonly settlementPartiesRepository: SettlementPartiesRepository) {
    }

    public async accountValidation(payloadData: any) {
        const urls = JSON.parse(process.env.MMS_SERVICE_SECRETS);

        try {
            const httpsAgent = new https.Agent({
                rejectUnauthorized: false, // Allow self-signed certificates
            });

            const settlementPartiesDetails = await this.settlementPartiesRepository.findById('INTERPAY');
            const integrationDetails: IntegrationDetailsDto = settlementPartiesDetails.integrationDetails;

            const encodedBase64Data = Buffer.from(`${integrationDetails.basicAuthUsername}:${integrationDetails.basicAuthPassword}`).toString('base64');
            const authorization = "Basic " + encodedBase64Data;

            const postData = JSON.stringify(payloadData);

            const options: https.RequestOptions = {
                hostname: new URL(urls.account_validation).hostname,
                path: new URL(urls.account_validation).pathname,
                method: 'POST',
                headers: {
                    'apiKey': integrationDetails.apiKey,
                    'Content-Type': 'application/json',
                    'Authorization': authorization,
                    'Content-Length': Buffer.byteLength(postData),
                },
                agent: httpsAgent,
            };

            return await this.makeHttpRequest(options, postData);

        } catch (error) {
            throw new BadRequestException("Error while validating account");
        }
    }

    private makeHttpRequest(options: https.RequestOptions, postData: string): Promise<any> {
        return new Promise((resolve, reject) => {
            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    if (res.statusCode && res.statusCode >= 200 && res.statusCode < 300) {
                        resolve(JSON.parse(data));
                    } else {
                        reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
                    }
                });
            });

            req.on('error', (e) => {
                reject(new Error(`Problem with request: ${e.message}`));
            });

            req.write(postData);
            req.end();
        });
    }
}
