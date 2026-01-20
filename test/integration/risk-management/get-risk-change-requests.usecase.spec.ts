import { DatasourceService } from "@app/core/db/datasource.service"
import { RequestContext } from "@app/core/middleware/request_context"
import { CoreModule } from "@app/core/module"
import { ChangeRequestEntity } from "@app/feature/change-requests/entities/change-request.entity"
import { ChangeRequestsRepository } from "@app/feature/change-requests/repositories/change-requests.repository"
import { ChangeRequestsDbRepository } from "@app/feature/change-requests/repositories/db/change-requests.repository"
import { Result } from "@app/feature/common/result"
import { RiskChangeRequestListResponseDto } from "@app/feature/risk-management/dtos/response-dtos/change-requests-list-response.dto"
import { GetRiskChangeRequestListUsecase } from "@app/feature/risk-management/usecases/get-change-requests.usecase"
import { GetRiskChangeRequestListUsecaseRequest } from "@app/feature/risk-management/usecases/request/get-change-requests.usecase.request"
import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DatabaseTestModule } from "@test/core/db/database.module.test"
import { commonFilterRequestStub } from "@test/mock/common-filter.request.stub"
import { currentUserStub, requestContextStub } from "@test/mock/common-request-context.stub"
import { errorStub } from "@test/mock/error.stub"
import { AsyncLocalStorage } from "async_hooks"

describe('Testing GetChangeRequestsUsecase',()=>{
    let getChangeRequestListusecase: GetRiskChangeRequestListUsecase;
    let changeRequestDbRepository: ChangeRequestsRepository;
    const als: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>()
    als.enterWith(requestContextStub())
    let response;
    const request = new GetRiskChangeRequestListUsecaseRequest(commonFilterRequestStub());
    
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                CoreModule,
                DatabaseTestModule,
                TypeOrmModule.forFeature([ChangeRequestEntity])
            ],
            providers:[
                GetRiskChangeRequestListUsecase,
                {
                    provide: AsyncLocalStorage,
                    useValue: als
                },
                DatasourceService,
                ChangeRequestsDbRepository
            ]
        }).compile();

        getChangeRequestListusecase = module.get<GetRiskChangeRequestListUsecase>(GetRiskChangeRequestListUsecase);
        changeRequestDbRepository = module.get<ChangeRequestsRepository>(ChangeRequestsDbRepository);

        response = await getChangeRequestListusecase.execute(request, als.getStore());
    })
    it('should return success response',async ()=>{
        expect(response).toBeDefined()
        expect(response).toBeInstanceOf(Result)
        expect(response.code).toBe("0")
        expect(response.message).toBe("SUCCESS")
        expect(response.data).toBeDefined()
    })
    it('should return list in response',()=>{
        expect(response.data.list).toBeDefined()
        expect(response.data.list.length).toBeGreaterThanOrEqual(1)
    })
    it('should return change requests as type of RiskChangeRequestListResponseDto',()=>{
        response.data.list.forEach(element => {
            expect(element).toMatchObject<RiskChangeRequestListResponseDto>(
                {
                    riskTitle        : expect.any(String),
                    riskType         : expect.any(String),
                    mcc              : expect.any(String),
                    affectedMerchants: expect.any(Number),
                    requestedBy      : expect.any(String),
                    requestedFor     : expect.any(String),
                    requestedDateTime: expect.any(String),
                    status           : expect.any(String),
                    refId            : expect.any(String),
                    changeRequestId  : expect.any(String)
                }
            )
        });
    })
    it('should throw error if requesting institution is ISSUER', async ()=>{
        const currentUser = currentUserStub();
        currentUser.requestedInstitutionType = 'ISSUER';
        const requestContext = new RequestContext(currentUser);
        try{
            await getChangeRequestListusecase.execute(request, requestContext);
        }catch(err){
            expect(err).toEqual(errorStub)
            expect(err.errors[0]).toStrictEqual(new BadRequestException("Sorry, you are not allowed to access this resource."));
        }
    })
})