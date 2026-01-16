import { Module } from "@nestjs/common";
import { SparrowSmsService } from "./sparrow-sms.service";

@Module({
	imports: [],
	providers: [SparrowSmsService],
	exports: [SparrowSmsService],
})
export class SparrowSmsModule {}
