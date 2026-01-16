import {
	BooleanColumn,
	IntegerColumn,
	PrimaryTextColumn,
	TextColumn,
} from "CMS-BACK-END/src/shared/entities/entities.decorator";
import { Entity } from "typeorm";
import { OTP_OPERATION } from "./otp.dto";

@Entity({ name: "otp" })
export class Otp {
	@PrimaryTextColumn()
	operationId: string;

	@TextColumn()
	createdTime: string;

	@TextColumn()
	otpValue: string;

	@TextColumn()
	operationType: OTP_OPERATION;

	@IntegerColumn()
	otpSentCount: number;

	@IntegerColumn()
	otpRetryCount: number;

	@IntegerColumn()
	otpResendCount: number;

	@TextColumn()
	timer: string;

	@BooleanColumn()
	blocked: boolean;

	@TextColumn()
	expiryTime: string;
}
