import { JwtStrategy } from "@app/core/auth/JwtStrategy";
import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { UserLoginUsecase } from "./usecase/user-login.usecase";
import { UserLoginService } from "./services/user-login.service";
import { UserDbRepository } from "../identity-access/repositories/db/user.repository";
import { UserCredentialDbRepository } from "../identity-access/repositories/db/user-credential.repository";
import { RolesDbRepository } from "../identity-access/repositories/db/roles.repository";
import { GeneralPolicyDbRepository } from "../identity-access/repositories/db/general-policy.repository";
import { UserLogoutUsecase } from "./usecase/user-logout.usecase";
import { PermissionsCheckerService } from "./services/permissions-checker.service";
import { UserPoolService } from "@app/core/cache/user-pool.service";
import { changePasswordUsecase } from "./usecase/change-password.usecase";
import { ClientDbRepository } from "../identity-access/repositories/db/client.repository";

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
        ClientDbRepository,
        JwtStrategy,
        UserLogoutUsecase,
        PermissionsCheckerService,
        UserPoolService,
        changePasswordUsecase

    ],
    exports: [
        UserDbRepository,
        RolesDbRepository,
        UserCredentialDbRepository,
        ClientDbRepository,
        PermissionsCheckerService,
    ],
})
export class AuthModule { }
