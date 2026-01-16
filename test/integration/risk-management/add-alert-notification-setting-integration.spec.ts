import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { MessagingManagementSettingsEntity } from "@app/feature/messaging-management-settings/entities/messaging-management-settings.entity";
import { MessagingManagementSettingsDbRepository } from "@app/feature/messaging-management-settings/repositories/db/messaging-management-settings-db.repository";
import { MessagingManagementSettingsRepository } from "@app/feature/messaging-management-settings/repositories/messaging-management-settings.repository";
import { AddUpdateAlertNotificationSettingUsecase } from "@app/feature/risk-management/usecases/add-alert-notification-setting.usecase";
import { AddUpdateAlertNotificationSettingRequest } from "@app/feature/risk-management/usecases/request/add-alert-notification-setting.request";
import { InstitutionCodePrefixType } from "CMS-BACK-END/src/shared/constants/institution-code-prefix.constant";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";

describe('AddAlertNotificationSettingIntegration', () => {
    let messagingManagementSettingsRepository: MessagingManagementSettingsRepository;
    let usecase: AddUpdateAlertNotificationSettingUsecase; 
    let als : AsyncLocalStorage<RequestContext>;
    let datasourceService: DatasourceService; 
    let requestContext: RequestContext; 
    let currentUser: CurrentUser; 

    beforeEach(async() => { 
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CoreModule, 
                DatabaseTestModule, 
                TypeOrmModule.forFeature([MessagingManagementSettingsEntity])
            ], 
            providers: [
                AddUpdateAlertNotificationSettingUsecase, 
                {
                    provide: AsyncLocalStorage,
                    useValue: new AsyncLocalStorage<RequestContext>(), 
                }, 
                DatasourceService, 
                MessagingManagementSettingsDbRepository,
            ], 
        }).compile();
        usecase = module.get<AddUpdateAlertNotificationSettingUsecase>(
            AddUpdateAlertNotificationSettingUsecase
          );
          messagingManagementSettingsRepository =
            module.get<MessagingManagementSettingsRepository>(
              MessagingManagementSettingsDbRepository
            );
          datasourceService = module.get<DatasourceService>(DatasourceService);

          currentUser = new CurrentUser(
            "3e78f4f0-2a35-443d-8f70-4ca331d90432",
            "maker@getpay.com",
            "Maker User",
            "111",
            "institution_111",
            ["ISSUER", "ACQUIRER"]
          )
    });

    it("should be defined", () => {
        expect(usecase).toBeDefined();
      });

    /**
     * Test case for the getRepository method
     */
    it("should get a repository", async () => {
        const entity = MessagingManagementSettingsEntity;
        const repository = await datasourceService.getRepository(
        entity,
        InstitutionCodePrefixType.getSchema("111")
        );
        expect(repository).toBeDefined();
    });

    it('should throw an error for the wrong emailFor dropdown value', async () => {
        const riskAlertNotification = [
            {
                emailFor: "RISK_ALERTasdfasdfs",
                email: ['amankhadka101@gmail.com']
            }
        ]
        const request = new AddUpdateAlertNotificationSettingRequest({riskAlertNotification})

        currentUser.requestedInstitutionType = 'ACQUIRER';
        requestContext = new RequestContext(currentUser);

        try {
            await usecase.execute(request, requestContext);
          } catch (err) {
            expect(err).toBeDefined();
            expect(err.code).toBe("-1");
            expect(err.message).toBe("ERROR");
            expect(err.errors[0]).toStrictEqual(
              new BadRequestException(
                "Invalid email for RISK_ALERTasdfasdfs"
              )
            );
          }
    }); 

    /**
     * Test case for the execute method to save alert notification settings
     */
    it('should save alert notification settings', async () => {
        const riskAlertNotification = [
            {
                emailFor: "RISK_ALERT",
                email: ['amankhadka101@gmail.com']
            }
        ]
        const request = new AddUpdateAlertNotificationSettingRequest({riskAlertNotification})

        currentUser.requestedInstitutionType = 'ACQUIRER';
        requestContext = new RequestContext(currentUser);

        const response = await usecase.execute(request, requestContext);
        expect(response).toBeDefined();
        expect(response.code).toBe("0");
        expect(response.message).toBe("SUCCESS");
        expect(response.data.message).toBe("Successfully added alert notification setting");; 
    }); 

    /**
     * Test case for the execute method to throw an error if the request is sent from the ISSUER
     */
    it("should throw an error If the request is sent from the ISSUER", async () => {
        const riskAlertNotification = [
            {
                emailFor: "RISK_BLOCK",
                email: ['amankhadka101@gmail.com']
            }
        ]
        const request = new AddUpdateAlertNotificationSettingRequest({riskAlertNotification})

        currentUser.requestedInstitutionType = "ISSUER";
    
        requestContext = new RequestContext(currentUser);
    
        try {
          await usecase.execute(request, requestContext);
        } catch (err) {
          expect(err).toBeDefined();
          expect(err.code).toBe("-1");
          expect(err.message).toBe("ERROR");
          expect(err.errors[0]).toStrictEqual(
            new BadRequestException(
              "Sorry, you are not allowed to access this resource."
            )
          );
        }
      });

          /**
     * Test case for the execute method to save alert notification settings
     */


    it('should throw an error for the duplicate emailFor value', async () => {
        const riskAlertNotification = [
            {
                emailFor: "RISK_ALERT",
                email: ['amankhadka101@gmail.com']
            }
        ]
        const request = new AddUpdateAlertNotificationSettingRequest({riskAlertNotification})

        currentUser.requestedInstitutionType = 'ACQUIRER';
        requestContext = new RequestContext(currentUser);

        try{
            await usecase.execute(request, requestContext);
        }catch(err){
            expect(err).toBeDefined();
            expect(err.code).toBe("-1");
            expect(err.message).toBe("ERROR");
            expect(err.errors[0]).toStrictEqual(
                new BadRequestException(
                    "Alert notification setting for RISK_ALERT already exists"
                )
            );
        }
    }); 
    
})