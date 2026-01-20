import { JwtStrategy } from "@app/core/auth/JwtStrategy";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
@Module({
    imports: [],
    controllers: [AuthController],
    providers: [

        JwtStrategy,


    ],
    exports: [

    ],
})
export class AuthModule { }
