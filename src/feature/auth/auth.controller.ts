import { PermissionInterceptor } from "../../core/interceptors/permission.interceptor";
import { RequestContext } from "../../core/middleware/request_context";
import { Body, Controller, Post, UseInterceptors, Get } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { ChangePasswordDto } from "./dto/change-password.dto";
import { UserLoginDto } from "./dto/user-login.dto";
import { changePasswordUsecase } from "./usecases/change-password.usecase";
import { ChangePasswordUsecaseRequest } from "./usecases/request/change-password.usecase.request";
import { UserLoginUsecaseRequest } from "./usecases/request/user-login.usecase.request";
import { UserLoginUsecase } from "./usecases/user-login.usecase";
import { UserLogoutUsecaseRequest } from "./usecases/request/user-logout.usecase.request";
import { UserLogoutUsecase } from "./usecases/user-logout.usecase";
import { ApiBearerAuth, ApiHeader, ApiTags } from "@nestjs/swagger";
import { OtpDto } from "../../core/otp/otp.dto";
import { VerifyOtpDto } from "../../core/otp/verify-otp.dto";
import { SendLoginOtpUsecaseRequest } from "./usecases/request/send-login-otp.usecase.request";
import { VerifyLoginOtpUsecaseRequest } from "./usecases/request/verify-login-otp.usecase.request";
import { SendLoginOtpUsecase } from "./usecases/send-login-otp.usecase";
import { VerifyLoginOtpUsecase } from "./usecases/verify-login-otp.usecase";


@Controller("auth")
@UseInterceptors(PermissionInterceptor)
@ApiTags('Authentication')
@ApiHeader({
  name: 'Institutioncode',
  description: 'Institution Code for authentication',
  schema: { type: 'string', default: 'NICDNM57U'} ,
  required: true
})
export class AuthController {
	constructor(
		private userLoginUsecase: UserLoginUsecase,
		private userLogoutUsecase: UserLogoutUsecase,
		private changePasswordUsecase: changePasswordUsecase,
		private readonly als: AsyncLocalStorage<RequestContext>,
		private readonly sendLoginOtpUsecase: SendLoginOtpUsecase,
		private readonly verifyLoginOtpUsecase: VerifyLoginOtpUsecase
	) {}

	@Post("login")
	async login(@Body() body: UserLoginDto) {
		const { username, password } = body;
		const request = new UserLoginUsecaseRequest(
			username.toLowerCase(),
			password
		);
		const response = await this.userLoginUsecase.execute(
			request,
			this.als.getStore()
		);
		return response;
	}

	@Post("change-password")
	async changePassword(@Body() body: ChangePasswordDto) {
		const { password, confirmPassword, oldPassword, otp, username } = body;
		const request = new ChangePasswordUsecaseRequest(
			password,
			confirmPassword,
			oldPassword,
			otp,
			username
		);
		const response = await this.changePasswordUsecase.execute(
			request,
			this.als.getStore()
		);
		return response;
	}

  @Get("logout")
  @ApiBearerAuth('X-Xsrf-Token')
  async logout() {
    const response = await this.userLogoutUsecase.execute(
      new UserLogoutUsecaseRequest(),
      this.als.getStore()
    );
    return response;
  }

	// 	@Post("send-otp")
	// 	async sendOtp(@Body() body: OtpDto) {
	// 		const request = new SendLoginOtpUsecaseRequest(body);
	// 		const response = await this.sendLoginOtpUsecase.execute(
	// 			request,
	// 			this.als.getStore()
	// 		);
	// 		return response;
	// 	}

	// 	@Post("verify-otp")
	// 	async verifyOtp(@Body() body: VerifyOtpDto) {
	// 		const request = new VerifyLoginOtpUsecaseRequest(body);
	// 		const response = await this.verifyLoginOtpUsecase.execute(
	// 			request,
	// 			this.als.getStore()
	// 		);
	// 		return response;
	// 	}
}
