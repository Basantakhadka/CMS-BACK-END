import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { Result } from "@app/feature/common/result";
import { RiskAffectedMerchantsView } from "@app/feature/risk-management/entities/risk-affected-merchants.view";
import { RisksManagementEntity } from "@app/feature/risk-management/entities/risks-management.entity";
import { RiskTransactionVelocityEntity } from "@app/feature/risk-management/entities/risks-transaction-velocity.entity";
import { RiskTransactionVolumeEntity } from "@app/feature/risk-management/entities/risks-transaction-volume.entity";
import { RisksManagementDbRepository } from "@app/feature/risk-management/repositories/db/risks-management.repository";
import { GetTotalRiskManagementListCountUsecase } from "@app/feature/risk-management/usecases/get-total-risk-management-list-count.usecase";
import { GetRiskManagementListUsecaseRequest } from "@app/feature/risk-management/usecases/request/get-risk-management-list.usecase.request";
import { RiskTypeConstant } from "CMS-BACK-END/src/shared/constants/risk-type.constant";
import { ToggleStatusConstant } from "CMS-BACK-END/src/shared/constants/toggle-status.constant";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";

describe('GetTotalRiskManagementListCountUsecase', () => {
    let getTotalRiskManagementListCountUsecase: GetTotalRiskManagementListCountUsecase;
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
                    role: "123",
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
                // AlsModule
            ],
            providers: [
                RisksManagementDbRepository,
                {
                    provide: DatasourceService,
                    useValue: datasourceService
                },
                GetTotalRiskManagementListCountUsecase,
            ]
        }).compile();

        getTotalRiskManagementListCountUsecase = module.get<GetTotalRiskManagementListCountUsecase>(GetTotalRiskManagementListCountUsecase);
    });

    const defaultRequest: GetRiskManagementListUsecaseRequest = new GetRiskManagementListUsecaseRequest(
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
                await getTotalRiskManagementListCountUsecase.execute(defaultRequest, newAls.getStore());
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
            const response = await getTotalRiskManagementListCountUsecase.execute(
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

        it("should return total count of 0 for default request", async () => {
            //Arrange
            const newAls: AsyncLocalStorage<RequestContext> = new AsyncLocalStorage<RequestContext>();
            const requestContext = new RequestContext(defaultCurrentUser);
            newAls.enterWith(requestContext);

            //ACT
            const response = await getTotalRiskManagementListCountUsecase.execute(
                defaultRequest,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).toBe(3);
        });

        it("should return result with total count of 0 when risk type filter is MERCHANT_SPECIFIC", async () => {
            const request: GetRiskManagementListUsecaseRequest = new GetRiskManagementListUsecaseRequest(
                {
                    "filters": [
                        {
                            field: "riskType",
                            condition: "IN",
                            values: [RiskTypeConstant.MERCHANT_SPECIFIC.name]
                        }
                    ],
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
            const response = await getTotalRiskManagementListCountUsecase.execute(
                request,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).not.toBeGreaterThan(0);

            const mockElementsData: number = 0;
            expect(response.data.totalCount).toEqual(mockElementsData);
        });

        it("should return results with total count of 3 when risk type filter is DEFAULT", async () => {
            const request: GetRiskManagementListUsecaseRequest = new GetRiskManagementListUsecaseRequest(
                {
                    "filters": [
                        {
                            field: "riskType",
                            condition: "IN",
                            values: [RiskTypeConstant.DEFAULT.name]
                        }
                    ],
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
            const response = await getTotalRiskManagementListCountUsecase.execute(
                request,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).not.toBe(0);

            const mockElementsData: number = 3;
            expect(response.data.totalCount).toEqual(mockElementsData);
        });

        it("should return results result with total count of 0 when risk status filter is DISABLED", async () => {
            const request: GetRiskManagementListUsecaseRequest = new GetRiskManagementListUsecaseRequest(
                {
                    "filters": [
                        {
                            field: "riskStatus",
                            condition: "IN",
                            values: [ToggleStatusConstant.DISABLED.name]
                        }
                    ],
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
            const response = await getTotalRiskManagementListCountUsecase.execute(
                request,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).not.toBeGreaterThan(0);

            const mockElementsData: number = 0;
            expect(response.data.totalCount).toEqual(mockElementsData);
        });

        it("should return results with total count of 3 when risk status filter is ENABLED", async () => {
            const request: GetRiskManagementListUsecaseRequest = new GetRiskManagementListUsecaseRequest(
                {
                    "filters": [
                        {
                            field: "riskStatus",
                            condition: "IN",
                            values: [ToggleStatusConstant.ENABLED.name]
                        }
                    ],
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
            const response = await getTotalRiskManagementListCountUsecase.execute(
                request,
                newAls.getStore()
            );

            // Assert
            expect(response).toBeDefined();
            expect(response.code).toBe("0");
            expect(response.message).toBe("SUCCESS");
            expect(response.data).toBeDefined();
            expect(response.data.totalCount).toBeDefined();
            expect(response.data.totalCount).not.toBe(0);

            const mockElementsData: number = 3;
            expect(response.data.totalCount).toEqual(mockElementsData);
        });

    });
});