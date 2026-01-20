import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { RequestContext } from "@app/core/middleware/request_context";
import { Body, Controller, Post, UseInterceptors, Get } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";



@Controller("auth")
@UseInterceptors(PermissionInterceptor)

export class AuthController {
    constructor (

        private readonly als: AsyncLocalStorage<RequestContext>,

    ) { }

    @Post("login")
    async login(@Body() body: any) {
        const { username, password } = body;
        // const request = new UserLoginUsecaseRequest(
        //     username.toLowerCase(),
        //     password
        // );
        // const response = await this.userLoginUsecase.execute(
        //     request,
        //     this.als.getStore()
        // );
        // return response;
    }


}
