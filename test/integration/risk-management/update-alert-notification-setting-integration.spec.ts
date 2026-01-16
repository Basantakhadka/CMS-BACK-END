import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context"
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { MessagingManagementSettingsEntity } from "@app/feature/messaging-management-settings/entities/messaging-management-settings.entity";
import { MessagingManagementSettingsDbRepository } from "@app/feature/messaging-management-settings/repositories/db/messaging-management-settings-db.repository";
import { MessagingManagementSettingsRepository } from "@app/feature/messaging-management-settings/repositories/messaging-management-settings.repository";
import { GetRiskAlertNotificationDetailsRequest } from "@app/feature/risk-management/usecases/request/get-risk-alert-notification-details.request";
import { UpdateAlertNotificationSettingUsecase } from "@app/feature/risk-management/usecases/update-alert-notification-setting.usecase"
import { TestingModule, Test } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks"

describe('UpdateAlertNotificationSettingIntegration', () => {
    let usecase: UpdateAlertNotificationSettingUsecase; 
    let messagingManagementSettingsRepository: MessagingManagementSettingsRepository;
    let als: AsyncLocalStorage<RequestContext>; 
    let requestContext: RequestContext;
    let datasourceService: DatasourceService;
    let request: GetRiskAlertNotificationDetailsRequest;
    let currentUser: CurrentUser;


    beforeEach(async() => { 
        const module: TestingModule = await Test.createTestingModule({
            imports: [
                CoreModule,
                DatabaseTestModule,
                TypeOrmModule.forFeature([MessagingManagementSettingsEntity]),
            ],
            providers: [
                UpdateAlertNotificationSettingUsecase,
                {
                    provide: AsyncLocalStorage,
                    useValue: new AsyncLocalStorage<RequestContext>(),
                },
                DatasourceService,
                MessagingManagementSettingsDbRepository,
            ],
        }).compile();

        usecase = module.get<UpdateAlertNotificationSettingUsecase>(UpdateAlertNotificationSettingUsecase);
        messagingManagementSettingsRepository = module.get<MessagingManagementSettingsRepository>(MessagingManagementSettingsDbRepository);
        datasourceService = module.get<DatasourceService>(DatasourceService);

        /**
        * Create a new CurrentUser object
        */
        currentUser = new CurrentUser(
            "3e78f4f0-2a35-443d-8f70-4ca331d90432",
            "maker@getpay.com",
            "Maker User",
            "institution_111",
            "111",
            ["ISSUER", "ACQUIRER"]
        );
    })


    it("should be defined", () => {
        expect(usecase).toBeDefined();
    });

    /**
     * TODO: Add test cases for the update alert notification setting
     */
    it('should update alert notification setting', async() => {

    })


})

// "list": [
//     {
//         "id": "4a0e8ab5-3c29-4574-9780-e180c01cc6b0",
//         "emailFor": "RISK_ALERT",
//         "email": [
//             "amankhadka101@gmail.com"
//         ]
//     },
//     {
//         "id": "90e10103-bfdd-4b7e-bd1d-7f8d4a58b70c",
//         "emailFor": "RISK_BLOCK",
//         "email": [
//             "amankhadka101@gmail.com"
//         ]
//     }
// ]