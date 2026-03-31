import { hashPassword } from "@app/core/hashing/hashing";
import { RequestContext } from "@app/core/middleware/request_context";
import { Usecase } from "@app/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { GeneralPolicy } from "@app/feature/identity-access/entities/general-policy.entity";
import { UserCredential } from "@app/feature/identity-access/entities/user-credential.entity";
import { User } from "@app/feature/identity-access/entities/user.entity";
import { GeneralPolicyDbRepository } from "@app/feature/identity-access/repositories/db/general-policy.repository";
import { UserCredentialDbRepository } from "@app/feature/identity-access/repositories/db/user-credential.repository";
import { UserDbRepository } from "@app/feature/identity-access/repositories/db/user.repository";
import { GeneralPolicyRepository } from "@app/feature/identity-access/repositories/general-policy.repository";
import { UserCredentialRepository } from "@app/feature/identity-access/repositories/user-credential.repository";
import { UserRepository } from "@app/feature/identity-access/repositories/user.repository";
import { BadRequestException, Inject } from "@nestjs/common";
import { ChangePasswordUsecaseRequest } from "./request/change-password.usecase.request";
import { ChangePasswordUsecaseResponse } from "./response/change-password.usecsae.response";
import { UserPoolService } from "@app/core/cache/user-pool.service";

export class changePasswordUsecase
  implements Usecase<ChangePasswordUsecaseRequest, ChangePasswordUsecaseResponse>
{
  constructor(
    @Inject(UserCredentialDbRepository)
    private readonly userCredentialRepository: UserCredentialRepository,

    @Inject(UserDbRepository)
    private readonly userRepository: UserRepository,

    @Inject(GeneralPolicyDbRepository)
    private readonly generalPolicyRepository: GeneralPolicyRepository,

    @Inject(UserPoolService)
    private userPoolService: UserPoolService
  ) {}

  /**
   * Validate password only against required policy rules
   */
  private async validatePasswordPolicy(
    password: string,
    hashedPassword: string,
    generalPolicy: any
  ) {
    const policy = generalPolicy[0].passwordPolicy;

    if (password.length < policy.minLength) {
      throw new BadRequestException(
        `Password must be at least ${policy.minLength} characters`
      );
    }

    if (password.length > policy.maxLength) {
      throw new BadRequestException(
        `Password must not exceed ${policy.maxLength} characters`
      );
    }

    if (policy.requireLowercase && !/[a-z]/.test(password)) {
      throw new BadRequestException(
        "Password must contain at least one lowercase letter"
      );
    }

    if (policy.requireUppercase && !/[A-Z]/.test(password)) {
      throw new BadRequestException(
        "Password must contain at least one uppercase letter"
      );
    }

    if (policy.requireNumbers && !/[0-9]/.test(password)) {
      throw new BadRequestException(
        "Password must contain at least one number"
      );
    }

    if (policy.requireSpecialChars && !/[!@#$%^&*(),.?\":{}|<>]/.test(password)) {
      throw new BadRequestException(
        "Password must contain at least one special character"
      );
    }

    return {
      passwordHistory: [hashedPassword],
      expiryTime: null
    };
  }

  async execute(
    request: ChangePasswordUsecaseRequest,
    requestContext?: RequestContext
  ): Promise<Result<ChangePasswordUsecaseResponse>> {
    const id = requestContext.getCurrentUser().loginId;

    const user = await this.userRepository.findById(id);
    if (!user) {
      throw new BadRequestException("User not found");
    }

    const { password, confirmPassword } = request;

    if (password !== confirmPassword) {
      throw new BadRequestException("Passwords do not match");
    }

    const userCredential = await this.userCredentialRepository.findById(id);
    const generalPolicy = await this.generalPolicyRepository.findAll();

    const hashedPassword = await hashPassword(
      password,
      id,
      user.userId
    );

    const result = await this.validatePasswordPolicy(
      password,
      hashedPassword,
      generalPolicy
    );

    await this.userCredentialRepository.update({
      id,
      enforcePasswordChange: false,
      password: hashedPassword,
      passwordHistory: result.passwordHistory,
      expiryTime: result.expiryTime,
      version: Date.now().toString()
    });

    this.userPoolService.revokeSession(
      requestContext.getCurrentUser().userId,requestContext.getCurrentUser().clientCode
    );

    return Result.createSuccess(
      new ChangePasswordUsecaseResponse(
        true,
        "Password changed successfully."
      )
    );
  }
}
