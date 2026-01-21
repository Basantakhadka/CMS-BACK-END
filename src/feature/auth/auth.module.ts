import { JwtStrategy } from "@app/core/auth/JwtStrategy";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserLoginUsecase } from "./usecase/user-login.usecase";
import { UserLoginService } from "./services/user-login.service";
import { UserDbRepository } from "../identity-access/repositories/db/user.repository";
import { UserCredentialDbRepository } from "../identity-access/repositories/db/user-credential.repository";
import { RolesDbRepository } from "../identity-access/repositories/db/roles.repository";
import { GeneralPolicyDbRepository } from "../identity-access/repositories/db/general-policy.repository";

@Module({
    imports: [],
    controllers: [AuthController],
    providers: [
        UserLoginUsecase,
        UserLoginService,
        UserDbRepository,
        UserCredentialDbRepository,
        RolesDbRepository,
        GeneralPolicyDbRepository,
        JwtStrategy,

    ],
    exports: [
        UserDbRepository,
        RolesDbRepository,
        UserCredentialDbRepository,
    ],
})
export class AuthModule { }
