import { Contract } from "@app/feature/contracts/entities/contracts.entity";
import { GeneralPolicy } from "@app/feature/identity-access/entities/general-policy.entity";
import { Role } from "@app/feature/identity-access/entities/roles.entity";
import { UserCredential } from "@app/feature/identity-access/entities/user-credential.entity";
import { User, UserByRole } from "@app/feature/identity-access/entities/user.entity";

export const entities = [
    User,
    UserCredential,
    UserByRole,
    GeneralPolicy,
    Role,
    Contract
];
