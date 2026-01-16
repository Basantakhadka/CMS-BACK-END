import { Inject, Injectable } from "@nestjs/common";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";
import { Role } from "CMS-BACK-END/src/feature/identity-access/entities/roles.entity";
import { FilterCondition } from "CMS-BACK-END/src/shared/constants/filter-condition.constant";
import { RolesDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/roles.repository";
import { RolesRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/roles.repository";
import { UserRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/user.repository";


@Injectable()
export class PermissionsCheckerService {
    constructor(
        @Inject(UserDbRepository)
        private readonly userRepository : UserRepository,
        @Inject(RolesDbRepository)
        private readonly rolesRepository : RolesRepository,
    ){}

    async execute(userId:string, urlPermissions: Array<string>): Promise<boolean>{
        if(!urlPermissions){
            return true;
        }

        if(urlPermissions){
            const user = await this.userRepository.findById(userId);
            let userRoles:Array<string> = [];
            user.roles.map(role=>{
                userRoles.push(role.value)
            });
            let filters:Filter[] = [];
            filters.push(new Filter(Role.getColumnName('id'), FilterCondition.IN.name, userRoles));
            
            const rolePermissions = await this.rolesRepository.findPermissionsByRoles(filters);
            let allowedPermissions: Set<string> = new Set();
            rolePermissions.map(rolePermission=>{
                if(!rolePermission.deleted || rolePermission.active){
                    rolePermission.permissions.map(permission =>{
                        allowedPermissions.add(permission);
                    })
                }
            })
    
            let hasPermission = urlPermissions.some((urlPermission) => allowedPermissions.has(urlPermission));
    
            return hasPermission;
        }
    }

}