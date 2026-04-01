
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    UseInterceptors,
} from "@nestjs/common";
import { CreateContractDto } from "./dtos/create-contract.dtos";

// import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { RequestContext } from "@app/core/middleware/request_context";
import { AsyncLocalStorage } from "async_hooks";
import { ApiTags } from "@nestjs/swagger";
import { AddContractUsecaseRequest } from "./usecase/request/add-contract.usecase.request";
import { AddContractUsecase } from "./usecase/add-contract.usecase";
import { PermissionInterceptor } from "@app/core/interceptors/permission.interceptor";
import { UpdateContractUsecaseRequest } from "./usecase/request/update-contract.usecase.request";
import { UpdateContractDto } from "./dtos/update-contract.dtos";
import { UpdateContractUsecase } from "./usecase/update-contract.usecase";
import { DeleteContractUsecaseRequest } from "./usecase/request/delete-contract.usecase.request";
import { DeleteContractUsecase } from "./usecase/delete-contract.usecase";
import { FilterConditionsDto } from "@app/shared/dtos/filter-conditions.dto";
import { GetContractListUsecaseRequest } from "./usecase/request/get-contractList.usecase.request";
import { GetContractsListUsecase } from "./usecase/get-contractList.usecase";
import { GetOneContractUsecaseRequest } from "./usecase/request/get-one-contract.usecase.request";
import { GetOneContractUsecase } from "./usecase/get-one-contract.usecase";
import {  GetContractsForSelectMenuUsecase } from "./usecase/get-contract-dropdown.usecase";
import { GetContractChangeRequestListUsecase } from "./usecase/get-contract-change-requests.usecase";
import { GetContractChangeRequestListUsecaseRequest } from "./usecase/request/get-contract-change-requests.usecase.request";
import { GetContractChangeRequestDetailsUsecase } from "./usecase/get-contract-change-request.usecase";
import { GetContractChangeRequestDetailsUsecaseRequest } from "./usecase/request/get-contract-change-request.usecase.request";
import { ApproveContractChangeRequestUsecase } from "./usecase/approve-contract-change-request.usecase";
import { ApproveContractChangeRequestUsecaseRequest } from "./usecase/request/approve-contract-change-request.usecase.request";
import { RejectContractChangeRequestUsecase } from "./usecase/reject-contract-change-request.usecase";
import { RejectContractChangeRequestUsecaseRequest } from "./usecase/request/reject-contract-change-request.usecase.request";
import { ContractChangeRequestActionDto, RejectContractChangeRequestDto } from "./dtos/contract-change-request-action.dto";



@ApiTags('Contracts')
@Controller("contracts")
@UseInterceptors(PermissionInterceptor)
export class ContractsController {
    constructor(
        private readonly addContractUsecase: AddContractUsecase,
        private readonly deleteContractUsecase:DeleteContractUsecase,
        private readonly getContractListUsecase:GetContractsListUsecase,
        private readonly getOneContractUsecase:GetOneContractUsecase,
        private readonly updateContractUsecase: UpdateContractUsecase,
        private readonly getContractDropdownUsecase: GetContractsForSelectMenuUsecase,
        private readonly getContractChangeRequestListUsecase: GetContractChangeRequestListUsecase,
        private readonly getContractChangeRequestDetailsUsecase: GetContractChangeRequestDetailsUsecase,
        private readonly approveContractChangeRequestUsecase: ApproveContractChangeRequestUsecase,
        private readonly rejectContractChangeRequestUsecase: RejectContractChangeRequestUsecase,

        private readonly als: AsyncLocalStorage<RequestContext>
    ) { }

    @Post("/add")
    async saveContract(@Body() body: CreateContractDto) {
        const createContract: CreateContractDto = body;

        const request = new AddContractUsecaseRequest(
            createContract.title,   
            createContract.type,   
            createContract.parties,         
            createContract.expiryDate,  
            createContract.contractDate,       
            createContract.documentLink,    // documentLink
            createContract.contractValue,   // contractValue (optional)
            createContract.jurisdiction,     // jurisdiction (optional)
            createContract.renewalTerms,
            createContract.governingLaw ,
            createContract.scopeOfWork,
            createContract.amendmentDate,
            createContract.amendmentLink,
            createContract.terminationNoticeDays
        );

        return await this.addContractUsecase.execute(request, this.als.getStore());
    }


    @Post("/list")
    async getContract(@Body() body: FilterConditionsDto) {
        const filterConditions: FilterConditionsDto = body;
        const request = new GetContractListUsecaseRequest(filterConditions);
        return await this.getContractListUsecase.execute(request, this.als.getStore());
    }

    @Post("/change-requests/list")
    async getContractChangeRequests(@Body() body: FilterConditionsDto) {
        const request = new GetContractChangeRequestListUsecaseRequest(body);
        return await this.getContractChangeRequestListUsecase.execute(request, this.als.getStore());
    }

    @Get("/change-requests/:id")
    async getContractChangeRequest(@Param("id") id: string) {
        const request = new GetContractChangeRequestDetailsUsecaseRequest(id);
        return await this.getContractChangeRequestDetailsUsecase.execute(request, this.als.getStore());
    }

    @Post("/change-requests/:id/approve")
    async approveContractChangeRequest(
        @Param("id") id: string,
        @Body() body: ContractChangeRequestActionDto,
    ) {
        const request = new ApproveContractChangeRequestUsecaseRequest(id, body?.remarks);
        return await this.approveContractChangeRequestUsecase.execute(request, this.als.getStore());
    }

    @Post("/change-requests/:id/reject")
    async rejectContractChangeRequest(
        @Param("id") id: string,
        @Body() body: RejectContractChangeRequestDto,
    ) {
        const request = new RejectContractChangeRequestUsecaseRequest(id, body.remarks);
        return await this.rejectContractChangeRequestUsecase.execute(request, this.als.getStore());
    }

    @Get("/:id")
    async getOneContract(@Param("id") id: string) {
        const request = new GetOneContractUsecaseRequest(id);
        return await this.getOneContractUsecase.execute(request, this.als.getStore());
    }

    @Put("/:id")
    async updateContract(@Param("id") id: string, @Body() body: UpdateContractDto) {
        const updateContract: UpdateContractDto = body;
        const request = new UpdateContractUsecaseRequest(
            id,
            updateContract.title,
            updateContract.type,    
            updateContract.parties,          
            updateContract.expiryDate,   
            updateContract.contractDate,
            updateContract.documentLink,    
            updateContract.contractValue,   
            updateContract.jurisdiction,     
            updateContract.renewalTerms,
            updateContract.governingLaw,
            updateContract.scopeOfWork,
            updateContract.amendmentDate,
            updateContract.amendmentLink,
            updateContract.terminationNoticeDays
        );
        return await this.updateContractUsecase.execute(request, this.als.getStore());
    }

    @Delete("/:id")
    async deleteContract(@Param("id") id: string) {
        const request = new DeleteContractUsecaseRequest(id);
        return await this.deleteContractUsecase.execute(request, this.als.getStore());
    }

    @Get("/dropdown/list")
    async getDropdown() {
        return this.getContractDropdownUsecase.execute();
    }


}
