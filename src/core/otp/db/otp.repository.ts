import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { OtpRepository } from "CMS-BACK-END/src/core/otp/otp.repository";
import { InstitutionCodePrefixType } from "CMS-BACK-END/src/shared/constants/institution-code-prefix.constant";
import { Injectable } from "@nestjs/common";
import { Repository } from "typeorm";
import { OTP_OPERATION } from "../otp.dto";
import { Otp } from "../otp.entity";

@Injectable()
export class OtpDbRepository implements OtpRepository {
	constructor(private dataSourceService: DatasourceService) {}

	private repository: Repository<Otp>;

	private async setRepository(institutionCode?: string) {
		this.repository = await this.dataSourceService.getRepository(
			Otp,
			InstitutionCodePrefixType.getSchema(institutionCode)
		);
	}

	async find(otp: Otp, institutionCode: string): Promise<Otp> {
		await this.setRepository(institutionCode);
		return await this.repository.findOneBy({ operationId: otp.operationId });
	}
	async insert(otp: Otp, institutionCode: string): Promise<Otp> {
		await this.setRepository(institutionCode);
		return (await this.repository.insert(otp)).raw[0];
	}
	async update(otp: Otp, institutionCode: string): Promise<Partial<Otp>> {
		await this.setRepository(institutionCode);
		return (await this.repository.update({ operationId: otp.operationId }, otp))
			.raw[0];
	}

	async findOtp(
		operationId: string,
		operationType: OTP_OPERATION,
		institutionCode: string
	): Promise<Otp> {
		await this.setRepository(institutionCode);
		return await this.repository.findOneBy({ operationId, operationType });
	}
}
