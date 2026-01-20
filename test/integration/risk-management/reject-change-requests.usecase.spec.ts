import { DatasourceService } from "@app/core/db/datasource.service"
import { RequestContext } from "@app/core/middleware/request_context"
import { CoreModule } from "@app/core/module"
import { ChangeRequestEntity } from "@app/feature/change-requests/entities/change-request.entity"
import { ChangeRequestsRepository } from "@app/feature/change-requests/repositories/change-requests.repository"
import { ChangeRequestsDbRepository } from "@app/feature/change-requests/repositories/db/change-requests.repository"
import { Result } from "@app/feature/common/result"
import { UserDbRepository } from "@app/feature/identity-access/repositories/db/user.repository"
import { RejectRiskChangeRequestUsecase } from "@app/feature/risk-management/usecases/reject-risk-change-request.usecase"
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository"
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository"
import { WorkflowPermissionService } from "@app/feature/workflow/services/workflow-permission.service"
import { RejectChangeRequestUsecaseRequest } from "@app/shared/usecase/requests/reject-change-request.usecase.request"
import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DatabaseTestModule } from "@test/core/db/database.module.test"
import { currentUserStub, requestContextStub } from "@test/mock/common-request-context.stub"
import { errorStub } from "@test/mock/error.stub"
import { AsyncLocalStorage } from "async_hooks"

describe('Testing RejectRiskChangeRequestsUsecase',()=>{
    let rejectChangeRequestUsecase: RejectRiskChangeRequestUsecase;
    let changeRequestDbRepository: ChangeRequestsRepository;
    let datasourceService: DatasourceService;
    const als: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>()
    als.enterWith(requestContextStub())
    let response;
    const request = new RejectChangeRequestUsecaseRequest("3a9e7575-c413-40a8-8f31-53a552e16a06", "a0db1248-9b09-4ebf-b880-2929e69e4c2f", "This risk cannot be created.");
    
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                CoreModule,
                DatabaseTestModule,
                TypeOrmModule.forFeature([ChangeRequestEntity])
            ],
            providers:[
                RejectRiskChangeRequestUsecase,
                {
                    provide: AsyncLocalStorage,
                    useValue: als
                },
                DatasourceService,
                ChangeRequestsDbRepository,
                WorkflowTasksDbRepository,
                WorkflowPermissionService,
                WorkflowGroupDbRepository,
                UserDbRepository
            ]
        }).compile();

        rejectChangeRequestUsecase = module.get<RejectRiskChangeRequestUsecase>(RejectRiskChangeRequestUsecase);
        changeRequestDbRepository = module.get<ChangeRequestsRepository>(ChangeRequestsDbRepository);
        datasourceService = module.get<DatasourceService>(DatasourceService);

        response = await rejectChangeRequestUsecase.execute(request, als.getStore());
    })
    it('should return success response',async ()=>{
        expect(response).toBeDefined()
        expect(response).toBeInstanceOf(Result)
        expect(response.code).toBe("0")
        expect(response.message).toBe("SUCCESS")
        expect(response.data).toBeDefined()
    })
    it('should return success in response data',()=>{
        expect(response.data.success).toEqual<boolean>(true)
    })
    it('should throw error if requesting institution is ISSUER', async ()=>{
        const currentUser = currentUserStub();
        currentUser.requestedInstitutionType = 'ISSUER';
        const requestContext = new RequestContext(currentUser);
        try{
            await rejectChangeRequestUsecase.execute(request, requestContext);
        }catch(err){
            expect(err).toEqual(errorStub)
            expect(err.errors[0]).toStrictEqual(new BadRequestException("Sorry, you are not allowed to access this resource."));
        }
    })
})