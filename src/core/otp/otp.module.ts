import { GeneralPolicyDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/general-policy.repository";
import { Module } from "@nestjs/common";
import { OtpDbRepository } from "./db/otp.repository";
import { OtpService } from "./otp.service";

@Module({
	imports: [],
	providers: [OtpService, OtpDbRepository, GeneralPolicyDbRepository],
	exports: [OtpService, OtpDbRepository],
})
export class OtpModule {}
