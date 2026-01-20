import { DatasourceService } from "@app/core/db/datasource.service";
import { CurrentUser } from "@app/core/middleware/current_user";
import { RequestContext } from "@app/core/middleware/request_context";
import { CoreModule } from "@app/core/module";
import { Result } from "@app/feature/common/result";
import { RiskAffectedMerchantsView } from "@app/feature/risk-management/entities/risk-affected-merchants.view";
import { RisksManagementEntity } from "@app/feature/risk-management/entities/risks-management.entity";
import { RiskTransactionVelocityEntity } from "@app/feature/risk-management/entities/risks-transaction-velocity.entity";
import { RiskTransactionVolumeEntity } from "@app/feature/risk-management/entities/risks-transaction-volume.entity";
import { RisksManagementDbRepository } from "@app/feature/risk-management/repositories/db/risks-management.repository";
import { GetTotalMerchantAffectedByIndividualRiskCountUsecase } from "@app/feature/risk-management/usecases/get-total-merchant-affected-by-individual-risk-count.usecase";
import { GetListOfMerchantAffectedByIndividualRiskUsecaseRequest } from "@app/feature/risk-management/usecases/request/get-list-of-merchant-affected-by-individual-risk.usecase.request";
import { GetTotalMerchantAffectedByIndividualRiskCountUsecaseRequest } from "@app/feature/risk-management/usecases/request/get-total-merchant-affected-by-individual-risk-count.usecase.request";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "@test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";

describe('GetTotalMerchantAffectedByIndividualRiskCountUsecase', () => {
    let getTotalMerchantAffectedByIndividualRiskCountUsecase: GetTotalMerchantAffectedByIndividualRiskCountUsecase;
    let datasourceService: DatasourceService; // Declare datasourceService variable

    const als = new AsyncLocalStorage<RequestContext>();
    als.getStore = jest.fn().mockReturnValue(
        {
            currentUser: {
                institutionCode: "111",
                user: {
                    id: "3e78f4f0-2a35-443d-8f70-4ca331d90432",
                    username: "maker@getpay.com",
                    email: "maker@getpay.com",
                    role: "0e427a60-cedf-11ed-bcc4-25fdfe9b6d26",
                    institutionCode: "111",
                },
                schema: "institution_111"
            }
        }
    )

    const defaultCurrentUser = new CurrentUser(
        "3e78f4f0-2a35-443d-8f70-4ca331d90432",
        "maker@getpay.com",
        "Maker User",
        "institution_111",
        "111",
        ["ISSUER", "ACQUIRER"]
    );

    beforeEach(async () => {
        datasourceService = new DatasourceService(als);
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CoreModule,
                DatabaseTestModule,
                TypeOrmModule.forFeature([
                    RiskAffectedMerchantsView,
                    RisksManagementEntity,
                    RiskTransactionVelocityEntity,
                    RiskTransactionVolumeEntity,
                ]),
            ],
            providers: [
                RisksManagementDbRepository,
                {
                    provide: DatasourceService,
                    useValue: datasourceService
                },
                GetTotalMerchantAffectedByIndividualRiskCountUsecase,
            ]
        }).compile();

        getTotalMerchantAffectedByIndividualRiskCountUsecase = module.get<GetTotalMerchantAffectedByIndividualRiskCountUsecase>(GetTotalMerchantAffectedByIndividualRiskCountUsecase);
    });

    const defaultRequest: GetListOfMerchantAffectedByIndividualRiskUsecaseRequest = new GetListOfMerchantAffectedByIndividualRiskUsecaseRequest(
        "DEFAULT",
        {
            "filters": [],
            "pageInfo": {
                "current": 0,
                "size": 10,
                "target": 1,
                "state": {
                    "next": [],
                    "previous": []
                },
                "sortInfo": []
            },
            searchText: ""
        }
    );

    describe("execute", () => {
        it("When the user is not an acquirer, it should return error", async () => {
            // Arrange
            const newCurrentUser = new CurrentUser(
                "3e78f4f0-2a35-443d-8f70-4ca331d90432",
                "maker@getpay.com",
                "Maker User",
                "institution_111",
                "111",
                ["ISSUER"]
            );
            const newAls: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>();
            const requestContext = new RequestContext(newCurrentUser);
            newAls.enterWith(requestContext);

            //Assert
            try {
                await getTotalMerchantAffectedByIndividualRiskCountUsecase.execute(defaultRequest, newAls.getStore());
            } catch (error) {
                expect(error).toBeInstanceOf(Result); // Check if the error is of type NotFoundException
                expect(error.isSuccess()).toBe(false); // Check if the response indicates a failure
                expect(error.code).toBe("-1"); // Check the error code
                expect(error.message).toBe("ERROR");
                expect(error.data).toBe(null);
                expect(error.errors[0]).toBeInstanceOf(BadRequestException);
                expect(error.errors[0].status).toBe(400);
                expect(error.errors[0].message).toBe("Sorry, you are not allowed to access this resource.");
            }
        });

        it("should return a success result", async () => {
            //Arrange
            const newAls: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>();
            const requestContext = new RequestContext(defaultCurrentUser);
            newAls.enterWith(requestContext);

            //ACT
            const response = await getTotalMerchantAffectedByIndividualRiskCountUsecase.execute(
                defaultRequest,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
        });

        it("should return result with total count of 0 if risk code does not exist", async () => {
            const request: GetTotalMerchantAffectedByIndividualRiskCountUsecaseRequest = new GetTotalMerchantAffectedByIndividualRiskCountUsecaseRequest(
            "random risk code",
                {
                    "filters": [],
                    "pageInfo": {
                        "current": 0,
                        "size": 10,
                        "target": 1,
                        "state": {
                            "next": [],
                            "previous": []
                        },
                        "sortInfo": []
                    },
                    searchText: ""
                }
            );
            //Arrange
            const newAls: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>();
            const requestContext = new RequestContext(defaultCurrentUser);
            newAls.enterWith(requestContext);

            //ACT
            const response = await getTotalMerchantAffectedByIndividualRiskCountUsecase.execute(
                request,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).toBeLessThanOrEqual(0);

            const mockElementsData: number = 0;
            expect(response.data.totalCount).toEqual(mockElementsData);
        });

        it("should return results with total count of 3 when risk code is DEFAULT", async () => {
            //Arrange
            const newAls: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>();
            const requestContext = new RequestContext(defaultCurrentUser);
            newAls.enterWith(requestContext);

            //ACT
            const response = await getTotalMerchantAffectedByIndividualRiskCountUsecase.execute(
                defaultRequest,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).toBeGreaterThanOrEqual(3);

            const mockElementsData: number = 3;
            expect(response.data.totalCount).toEqual(mockElementsData);
        });
    });
});