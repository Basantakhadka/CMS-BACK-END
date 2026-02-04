
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

        private readonly als: AsyncLocalStorage<RequestContext>
    ) { }

    @Post("/add")
    async saveContract(@Body() body: CreateContractDto) {
        const createContract: CreateContractDto = body;
        console.log({ createContract })

        const request = new AddContractUsecaseRequest(
            createContract.title,   // contractTitle
            createContract.type,    // contractType
            createContract.parties,          // parties
            createContract.expiryDate,      // expiryDate
            createContract.documentLink,    // documentLink
            createContract.contractValue,   // contractValue (optional)
            createContract.jurisdiction,     // jurisdiction (optional)
            createContract.renewalTerms,
            createContract.governingLaw    // renewalTerms (optional)
        );

        return await this.addContractUsecase.execute(request, this.als.getStore());
    }


    @Post("/list")
    async getContract(@Body() body: FilterConditionsDto) {
        const filterConditions: FilterConditionsDto = body;
        const request = new GetContractListUsecaseRequest(filterConditions);
        return await this.getContractListUsecase.execute(request);
    }

    @Get("/:id")
    async getOneContract(@Param("id") id: string) {
        const request = new GetOneContractUsecaseRequest(id);
        return await this.getOneContractUsecase.execute(request);
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
            updateContract.documentLink,    
            updateContract.contractValue,   
            updateContract.jurisdiction,     
            updateContract.renewalTerms,
            updateContract.governingLaw
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
