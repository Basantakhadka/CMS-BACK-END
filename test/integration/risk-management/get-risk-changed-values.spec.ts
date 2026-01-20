import { DatasourceService } from "@app/core/db/datasource.service"
import { RequestContext } from "@app/core/middleware/request_context"
import { CoreModule } from "@app/core/module"
import { ChangeRequestEntity } from "@app/feature/change-requests/entities/change-request.entity"
import { ChangeRequestsRepository } from "@app/feature/change-requests/repositories/change-requests.repository"
import { ChangeRequestsDbRepository } from "@app/feature/change-requests/repositories/db/change-requests.repository"
import { Result } from "@app/feature/common/result"
import { GetRiskChangedValuesUsecase } from "@app/feature/risk-management/usecases/get-changed-values.usecase"
import { GetRiskChangedValuesUsecaseRequest } from "@app/feature/risk-management/usecases/request/get-changed-values.usecase.request"
import { BadRequestException } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TypeOrmModule } from "@nestjs/typeorm"
import { DatabaseTestModule } from "@test/core/db/database.module.test"
import { currentUserStub, requestContextStub } from "@test/mock/common-request-context.stub"
import { errorStub } from "@test/mock/error.stub"
import { AsyncLocalStorage } from "async_hooks"

describe('Testing GetChangedValuesUsecase',()=>{
    let getChangedValuesUsecase: GetRiskChangedValuesUsecase;
    let changeRequestDbRepository: ChangeRequestsRepository;
    const als: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>()
    als.enterWith(requestContextStub())
    let response;
    const request = new GetRiskChangedValuesUsecaseRequest('f1777aa2-ea63-42ce-b844-6e5d7a475a96','785db8dd-ab2d-45d0-985a-21106d39a90c');
    
    beforeAll(async ()=>{
        const module: TestingModule = await Test.createTestingModule({
            imports:[
                CoreModule,
                DatabaseTestModule,
                TypeOrmModule.forFeature([ChangeRequestEntity])
            ],
            providers:[
                GetRiskChangedValuesUsecase,
                {
                    provide: AsyncLocalStorage,
                    useValue: als
                },
                DatasourceService,
                ChangeRequestsDbRepository
            ]
        }).compile();

        getChangedValuesUsecase = module.get<GetRiskChangedValuesUsecase>(GetRiskChangedValuesUsecase);
        changeRequestDbRepository = module.get<ChangeRequestsRepository>(ChangeRequestsDbRepository);
        response = await getChangedValuesUsecase.execute(request, als.getStore());
    })
    it('should throw error if requesting institution is ISSUER', async ()=>{
        const currentUser = currentUserStub();
        currentUser.requestedInstitutionType = 'ISSUER';
        const requestContext = new RequestContext(currentUser);
        try{
            await getChangedValuesUsecase.execute(request, requestContext);
        }catch(err){
            expect(err).toEqual(errorStub)
            expect(err.errors[0]).toStrictEqual(new BadRequestException("Sorry, you are not allowed to access this resource."));
        }
    })
    it('should return success response',async ()=>{
        expect(response).toBeDefined()
        expect(response).toBeInstanceOf(Result)
        expect(response.code).toBe("0")
        expect(response.message).toBe("SUCCESS")
        expect(response.data).toBeDefined()
    })
    it('should return risk data as type of RiskManagementEntity',()=>{
        expect(response.data).toEqual({
            id: expect.any(String),
            title: expect.any(String),
            isEnabled: expect.any(Boolean),
            isDefault: expect.any(Boolean),
            mcc: expect.any(String),
            code: expect.any(String),
            status: expect.any(String),
            mccTitle: expect.any(String),
            effectiveFrom: expect.any(String),
            createdBy: {
              label: expect.any(String),
              value: expect.any(String),
            },
            createdOn: expect.any(String),
            transactionVelocity: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                paymentPoint: expect.any(String),
                paymentMode: expect.arrayContaining([expect.any(String)]),
                perMinuteTxnLimit: expect.any(Number),
                actionOnExceedPerMinuteTxnLimit: expect.any(String),
                perDayTxnLimit: expect.any(Number),
                actionOnExceedPerDayTxnLimit: expect.any(String),
                perMonthTxnLimit: expect.any(Number),
                actionOnExceedPerMonthTxnLimit: expect.any(String),
                perYearTxnLimit: expect.any(Number),
                actionOnExceedPerYearTxnLimit: expect.any(String),
              }),
            ]),
            transactionVolume: expect.arrayContaining([
              expect.objectContaining({
                id: expect.any(String),
                paymentPoint: expect.any(String),
                paymentMode: expect.arrayContaining([expect.any(String)]),
                minAllowedAmountPerTxn: expect.any(Number),
                actionOnFailMinAllowedAmountPerTxn: expect.any(String),
                maxAllowedAmountPerTxn: expect.any(Number),
                actionOnExceedMaxAllowedAmountPerTxn: expect.any(String),
                allowedTxnAmountPerDay: expect.any(Number),
                actionOnExceedAllowedTxnAmountPerDay: expect.any(String),
                allowedTxnAmountPerMonth: expect.any(Number),
                actionOnExceedAllowedTxnAmountPerMonth: expect.any(String),
                allowedTxnAmountPerYear: expect.any(Number),
                actionOnExceedAllowedTxnAmountPerYear: expect.any(String),
              }),
            ]),
        });
    })
})