import { DatasourceService } from "@app/core/db/datasource.service"
import { RequestContext } from "@app/core/middleware/request_context"
import { CoreModule } from "@app/core/module"
import { ChangeRequestEntity } from "@app/feature/change-requests/entities/change-request.entity"
import { ChangeRequestsRepository } from "@app/feature/change-requests/repositories/change-requests.repository"
import { ChangeRequestsDbRepository } from "@app/feature/change-requests/repositories/db/change-requests.repository"
import { Result } from "@app/feature/common/result"
import { RiskChangeRequestListResponseDto } from "@app/feature/risk-management/dtos/response-dtos/change-requests-list-response.dto"
import { GetRiskChangeRequestTotalCountUsecase } from "@app/feature/risk-management/usecases/get-change-request-total-count.usecase"
import { GetRiskChangeRequestTotalCountUsecaseRequest } from "@app/feature/risk-management/usecases/request/get-change-request-total-count.usecase.request"
import { GetRiskChangeRequestTotalCountUsecaseResponse } from "@app/feature/risk-management/usecases/response/get-risk-change-request-total-count.usecase.response"
import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DatabaseTestModule } from "@test/core/db/database.module.test"
import { commonFilterRequestStub } from "@test/mock/common-filter.request.stub"
import { currentUserStub, requestContextStub } from "@test/mock/common-request-context.stub"
import { errorStub } from "@test/mock/error.stub"
import { AsyncLocalStorage } from "async_hooks"

describe('Testing GetChangeRequestsTotalCountUsecase',()=>{
    let getChangeRequestTotalCountusecase: GetRiskChangeRequestTotalCountUsecase;
    let changeRequestDbRepository: ChangeRequestsRepository;
    const als: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>()
    als.enterWith(requestContextStub())
    let response: Result<GetRiskChangeRequestTotalCountUsecaseResponse>;
    const request = new GetRiskChangeRequestTotalCountUsecaseRequest(commonFilterRequestStub());
    
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                CoreModule,
                DatabaseTestModule,
                TypeOrmModule.forFeature([ChangeRequestEntity])
            ],
            providers:[
                GetRiskChangeRequestTotalCountUsecase,
                {
                    provide: AsyncLocalStorage,
                    useValue: als
                },
                DatasourceService,
                ChangeRequestsDbRepository
            ]
        }).compile();

        getChangeRequestTotalCountusecase = module.get<GetRiskChangeRequestTotalCountUsecase>(GetRiskChangeRequestTotalCountUsecase);
        changeRequestDbRepository = module.get<ChangeRequestsRepository>(ChangeRequestsDbRepository);

        response = await getChangeRequestTotalCountusecase.execute(request, als.getStore());
    })
    it('should return success response',async ()=>{
        expect(response).toBeDefined()
        expect(response).toBeInstanceOf(Result)
        expect(response.code).toBe("0")
        expect(response.message).toBe("SUCCESS")
        expect(response.data).toBeDefined()
    })
    it('should return list in response',()=>{
        expect(response.data.count).toBeDefined()
        expect(response.data.count).toBeGreaterThanOrEqual(0)
    })
    
    it('should throw error if requesting institution is ISSUER', async ()=>{
        const currentUser = currentUserStub();
        currentUser.requestedInstitutionType = 'ISSUER';
        const requestContext = new RequestContext(currentUser);
        try{
            await getChangeRequestTotalCountusecase.execute(request, requestContext);
        }catch(err){
            expect(err).toEqual(errorStub)
            expect(err.errors[0]).toStrictEqual(new BadRequestException("Sorry, you are not allowed to access this resource."));
        }
    })
})