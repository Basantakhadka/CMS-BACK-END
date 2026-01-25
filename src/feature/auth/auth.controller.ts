import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { RequestContext } from "@app/core/middleware/request_context";
import { Body, Controller, Get, Post, UseInterceptors } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { UserLoginDto } from "./dto/user-login.dto";
import { UserLoginUsecaseRequest } from "./usecase/request/user-login.usecase.request";
import { UserLoginUsecase } from "./usecase/user-login.usecase";
import { ApiBearerAuth } from "@nestjs/swagger";
import { UserLogoutUsecase } from "./usecase/user-logout.usecase";
import { UserLogoutUsecaseRequest } from "./usecase/request/user-logout.usecase.request";



@Controller("auth")
@UseInterceptors(PermissionInterceptor)

export class AuthController {
    constructor (
        private userLoginUsecase: UserLoginUsecase,
        private userLogoutUsecase: UserLogoutUsecase,
        private readonly als: AsyncLocalStorage<RequestContext>,

    ) { }

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


    @Get("logout")
    @ApiBearerAuth('X-Xsrf-Token')
    async logout() {
        const response = await this.userLogoutUsecase.execute(
            new UserLogoutUsecaseRequest(),
            this.als.getStore()
        );
        return response;
    }

}
