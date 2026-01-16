import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Usecase } from "CMS-BACK-END/src/core/usecase/usecase";
import { Result } from "@app/feature/common/result";
import { ChangeRequestType } from "CMS-BACK-END/src/shared/constants/change-request-type.constant";
import { DateUtils } from "CMS-BACK-END/src/shared/date-utils";
import { LabelValuePair } from "CMS-BACK-END/src/shared/entities/label-value-pair.view";
import { Inject, Injectable, NotFoundException } from "@nestjs/common";
import { RoleChangeRequest } from "../entities/roles.entity";
import { RolesDbRepository } from "../repositories/db/roles.repository";
import { RolesRepository } from "../repositories/roles.repository";
import { permissionTree } from "./get-permission.usecase";
import { RolesViewChangeRequestUsecaseRequest } from "./requests/roles-view-change-request.usecase.request";
import { FinalResult, RoleChangeRequestViewReponse, RolesViewChangeRequestUsecaseResponse } from "./response/roles-view-change-request.usecase.response";
@Injectable()
export class RolesViewChangeRequestUsecase implements Usecase<RolesViewChangeRequestUsecaseRequest, RolesViewChangeRequestUsecaseResponse>{
    constructor(
        @Inject(RolesDbRepository) private readonly rolesRepository: RolesRepository
    ){}
    async execute(request: RolesViewChangeRequestUsecaseRequest, requestContext?: RequestContext): Promise<Result<RolesViewChangeRequestUsecaseResponse>> {
        const changeRequest = new RoleChangeRequest();
        changeRequest.refId = request.roleId;
        changeRequest.id = request.id;
        const changeReq = (await this.rolesRepository.findChangeRequestById(changeRequest))[0];
        if(!changeReq){
          return Result.createError(new NotFoundException("Change Request Not Found!"));
        }
        changeReq.requestedOn = DateUtils.formatDate(new Date(changeReq.requestedOn).toISOString());
        const generalInfoRes = new RoleChangeRequestViewReponse();
        generalInfoRes.title = "General Information";
        const modulePerm = new RoleChangeRequestViewReponse();
        modulePerm.title = "Module Permissions"
        if (changeReq.type === ChangeRequestType.ADD.name) {
            generalInfoRes.fieldData = {fields:[new LabelValuePair("Status", "status"), new LabelValuePair("Role Name","roleName")],
                                        changedValue:{status:changeReq.active?"Active":"Not Active",roleName:changeReq.title}, originalValue:null}
            const changedVal = await this.preparePermissionResponse(changeReq.permissions, permissionTree);
            modulePerm.fieldData = {fields:await this.prepareFields(), changedValue:changedVal, originalValue:null}
            const response = new RolesViewChangeRequestUsecaseResponse(request.id,request.roleId,changeReq.requestedBy.label,ChangeRequestType.ADD.name,[generalInfoRes, modulePerm]);
            return Result.createSuccess(response);
          }
          if (changeReq.type === ChangeRequestType.UPDATE.name) {
            const role = await this.rolesRepository.findById(request.roleId);
            generalInfoRes.fieldData = {fields:[new LabelValuePair("Status", "status"), new LabelValuePair("Role Name","roleName")],
                                        changedValue:{status:changeReq.active?"Active":"Not Active",roleName:changeReq.title}, originalValue:{status:role.active?"Active":"Not Active",roleName:role.title}}
            const changedVal = await this.preparePermissionResponse(changeReq.permissions, permissionTree);
            modulePerm.fieldData = {fields:await this.prepareFields(), changedValue:changedVal, originalValue:await this.preparePermissionResponse(role.permissions, permissionTree)};
            const response = new RolesViewChangeRequestUsecaseResponse(request.id,request.roleId,changeReq.requestedBy.label,ChangeRequestType.UPDATE.name,[generalInfoRes, modulePerm]);
            return Result.createSuccess(response);
          }
          if (changeReq.type === ChangeRequestType.DELETE.name) {
            generalInfoRes.fieldData = {fields:[new LabelValuePair("Status", "status"), new LabelValuePair("Role Name","roleName")],
                                        changedValue:null, originalValue:{status:changeReq.active?"Active":"Not Active",roleName:changeReq.title}}
            const originalVal = await this.preparePermissionResponse(changeReq.permissions, permissionTree);
            modulePerm.fieldData = {fields:await this.prepareFields(), changedValue:null, originalValue:originalVal}
            const response = new RolesViewChangeRequestUsecaseResponse(request.id,request.roleId,changeReq.requestedBy.label,ChangeRequestType.DELETE.name,[generalInfoRes, modulePerm]);
            return Result.createSuccess(response);
          }
    } 
    async preparePermissionResponse(permissions:string[],tree: any[]):Promise<object>{
      const permissionMap: Map<string, FinalResult> = new Map();
      const changedValue:Map<string,any> = new Map();
      const recurse = (tree: any[], userPermissions:string[], parent:string) => {
        for(let i in tree){
          let result= new FinalResult(tree[i].label,[]);
          if(tree[i].permissions?.length < 1){
            return []
          }
          const permission = tree[i].permissions
            if(permission){
              
              for(let j=0; j<permission.length; j++){
                if(permission[j]?.key.split(':').length > 3){
                  result.title = parent+' : '+tree[i].label
                }
                for(let k in userPermissions){
                  if(userPermissions[k] === permission[j]?.key){
                    userPermissions.splice(parseInt(k),1)
                    result.permissions.push(permission[j]?.label);
                  }
                }
              }
              if(result.permissions.length>0){
                permissionMap.set(tree[i].key, result);
              }
            }
          if(tree[i].groups){
            recurse(tree[i].groups, userPermissions, result.title)
          }
          const fResult:object[] = [];
          
          permissionMap.forEach((val:any,key:any)=>{
            if(tree[i].key === key.split(':')[0]){
              val.permissions = val.permissions.sort().join(', ') 
      
              fResult.push(val);
            }
          })
          if(fResult.length>0){
            changedValue.set(tree[i].key, fResult);
          }
        }
        return Object.fromEntries(changedValue);
      }
      return recurse(tree, permissions,"");
    }
    async prepareFields():Promise<LabelValuePair[]>{
      let fields:LabelValuePair[] = [];
      permissionTree.forEach(i=>fields.push({label : i.label, value : i.key }));
      return fields;
    }
}