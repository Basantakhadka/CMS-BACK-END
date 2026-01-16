import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";
import {
  CreateGeneralPolicyDto,
  MultiFactorAuthentication,
  OTPSetting,
  PasswordPolicy,
} from "../../dtos/create-general-policy.dto";

export class SaveGeneralPolicyUsecaseRequest implements UsecaseRequest {
	constructor(
		public active: boolean,
		public usersMfa: MultiFactorAuthentication,
		public merchantsMfa: MultiFactorAuthentication,
		public passwordPolicy: PasswordPolicy,
		public usersOtpSetting: OTPSetting,
		public merchantsOtpSetting: OTPSetting,
		public merchantSignupOtpSetting: OTPSetting
	) {}
}
