import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { RisksManagementEntity } from "@app/feature/risk-management/entities/risks-management.entity";
import { RiskTransactionVelocityEntity } from "@app/feature/risk-management/entities/risks-transaction-velocity.entity";
import { RiskTransactionVolumeEntity } from "@app/feature/risk-management/entities/risks-transaction-volume.entity";
import { RisksManagementDbRepository } from "@app/feature/risk-management/repositories/db/risks-management.repository";
import { GetRiskManagementDetailsUsecase } from "@app/feature/risk-management/usecases/get-risk-management-details.usecase"
import { GetRiskManagementDetailsRequest } from "@app/feature/risk-management/usecases/request/get-risk-management-details.request";
import { CheckAssignedInstitutionTypeService } from "CMS-BACK-END/src/shared/services/check-assigned-institution-type.service";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";
import {BadRequestException} from "@nestjs/common";
import {
    GetRiskManagementDetailsStub,
    GetRiskManagementEmptyVelocityAndVolumeDetailsStub
} from "CMS-BACK-END/test/mock/risk-management/response/get-risk-management-details.stub";

describe('Get Risk Management Details Integration Test', () => {
    let usecase: GetRiskManagementDetailsUsecase
    let datasourceService: DatasourceService;
    let request: GetRiskManagementDetailsRequest; 
    const als = new AsyncLocalStorage<RequestContext>();
    let defaultCurrentUser: CurrentUser;
    let requestContext: RequestContext;
    let userDefinedAls = new AsyncLocalStorage<RequestContext>();
    als.getStore = jest.fn().mockReturnValue({
      currentUser: {
        institutionCode: "111",
        user: {
          id: "3e78f4f0-2a35-443d-8f70-4ca331d90432",
          username: "maker@getpay.com",
          email: "maker@getpay.com",
          role: "123",
          institutionCode: "111",
        },
        schema: "institution_111",
      },
    });

    beforeEach(async () => { 
        datasourceService = new DatasourceService(als); 
        const module: TestingModule = await Test.createTestingModule({
            imports: [CoreModule, DatabaseTestModule, TypeOrmModule.forFeature([
                RisksManagementEntity,
                RiskTransactionVelocityEntity,
                RiskTransactionVolumeEntity,
              ])],
            providers: [
                GetRiskManagementDetailsUsecase, 
                {
                    provide: DatasourceService, 
                    useValue: datasourceService
                }, 
                RisksManagementEntity,
                CheckAssignedInstitutionTypeService,
                RisksManagementDbRepository
            ]
        }).compile()
        usecase = module.get<GetRiskManagementDetailsUsecase>(GetRiskManagementDetailsUsecase);

        defaultCurrentUser = new CurrentUser(
            "3e78f4f0-2a35-443d-8f70-4ca331d90432",
            "maker@getpay.com",
            "Maker User",
            "institution_111",
            "111",
            ["ISSUER", "ACQUIRER"]
          );
    });


    it('should give an error as the institution type is only ISSUER', async () => {
        defaultCurrentUser = {
            ...defaultCurrentUser,
            institutionType: ["ISSUER"],
        };
        requestContext = new RequestContext(defaultCurrentUser);
        userDefinedAls.enterWith(requestContext);
        request = new GetRiskManagementDetailsRequest('1');
        try {
            await usecase.execute(request, requestContext)
        } catch (error) {
            expect(error).toBeDefined();
            expect(error.code).toBe('-1');
            expect(error.message).toBe("ERROR");
            expect(error.errors[0]).toEqual(new BadRequestException('Sorry, you are not allowed to access this resource.'))
        }
    });

    it("should give the detail of the risk with the id 1 and it's respective transaction velocity and volumn", async () => {
        defaultCurrentUser = {
            ...defaultCurrentUser,
            institutionType: ["ISSUER", "ACQUIRER"],
        };
        requestContext = new RequestContext(defaultCurrentUser);
        userDefinedAls.enterWith(requestContext);
        request = new GetRiskManagementDetailsRequest("1");

        const response = await usecase.execute(request, requestContext);

        expect(response).toBeDefined();
        expect(response.code).toBe("0");
        expect(response.message).toBe("SUCCESS");
        expect(response.data).toStrictEqual(GetRiskManagementDetailsStub())
    });

    it("should give the detail of the risk with the id 2 and empty array on volume and velocity", async() => {
        defaultCurrentUser = {
            ...defaultCurrentUser,
            institutionType: ["ISSUER", "ACQUIRER"],
        };
        requestContext = new RequestContext(defaultCurrentUser);
        userDefinedAls.enterWith(requestContext);
        request = new GetRiskManagementDetailsRequest("2");

        const response = await usecase.execute(request, requestContext);
        expect(response).toBeDefined();
        expect(response.code).toBe("0");
        expect(response.message).toBe("SUCCESS");
        expect(response.data).toStrictEqual(GetRiskManagementEmptyVelocityAndVolumeDetailsStub())
    });

    it("should throw error of not found risk management with the random id", async () => {
        defaultCurrentUser = {
            ...defaultCurrentUser,
            institutionType: ["ISSUER", "ACQUIRER"],
        };
        requestContext = new RequestContext(defaultCurrentUser);
        userDefinedAls.enterWith(requestContext);
        request = new GetRiskManagementDetailsRequest("20000000000");

        try {
            await usecase.execute(request, requestContext);
        }catch(error){
            expect(error).toBeDefined();
            expect(error.message).toBe("ERROR");
            expect(error.code).toBe("-1");
            expect(error.errors[0]).toEqual(new BadRequestException('Cannot find the Risk with 20000000000 id'))
        }
    })
})

