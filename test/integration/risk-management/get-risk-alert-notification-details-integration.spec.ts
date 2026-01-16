import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { MessagingManagementSettingsEntity } from "@app/feature/messaging-management-settings/entities/messaging-management-settings.entity";
import { MessagingManagementSettingsDbRepository } from "@app/feature/messaging-management-settings/repositories/db/messaging-management-settings-db.repository";
import { MessagingManagementSettingsRepository } from "@app/feature/messaging-management-settings/repositories/messaging-management-settings.repository";
import { GetRiskAlertNotificationDetailsUsecase } from "@app/feature/risk-management/usecases/get-risk-alert-notification-details.usecase";
import { GetRiskAlertNotificationDetailsRequest } from "@app/feature/risk-management/usecases/request/get-risk-alert-notification-details.request";
import { InstitutionCodePrefixType } from "CMS-BACK-END/src/shared/constants/institution-code-prefix.constant";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { GetRiskAlertNotificationDetailsResponseStub } from "CMS-BACK-END/test/mock/risk-management/response/get-risk-alert-notification-details.response.stub";
import { AsyncLocalStorage } from "async_hooks";

/**
 * Test cases for the GetRiskAlertNotificationDetailsUsecase
 */
describe("GetRiskAlertNotificationDetailsUsecase", () => {
  let usecase: GetRiskAlertNotificationDetailsUsecase;
  let messagingManagementSettingsRepository: MessagingManagementSettingsRepository;
  let als: AsyncLocalStorage<RequestContext>;
  let datasourceService: DatasourceService;
  let request: GetRiskAlertNotificationDetailsRequest;
  let requestContext: RequestContext;
  let currentUser: CurrentUser;

  /**
   * Before each test, create a new module with the required imports and providers
   */
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
        DatabaseTestModule,
        TypeOrmModule.forFeature([MessagingManagementSettingsEntity]),
      ],
      providers: [
        GetRiskAlertNotificationDetailsUsecase,
        {
          provide: AsyncLocalStorage,
          useValue: new AsyncLocalStorage<RequestContext>(),
        },
        DatasourceService,
        MessagingManagementSettingsDbRepository,
      ],
    }).compile();

    usecase = module.get<GetRiskAlertNotificationDetailsUsecase>(
      GetRiskAlertNotificationDetailsUsecase
    );
    messagingManagementSettingsRepository =
      module.get<MessagingManagementSettingsRepository>(
        MessagingManagementSettingsDbRepository
      );
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

  /**
   * Test case for the execute method that fetches the email notification settings for the risk alert
   */
  it("should give the values of the email notification settings for the risk alert", async () => {
    currentUser.requestedInstitutionType = "ACQUIRER";
    requestContext = new RequestContext(currentUser);

    const response = await usecase.execute(request, requestContext);
    expect(response).toBeDefined();
    expect(response.code).toBe("0");
    expect(response.message).toBe("SUCCESS");
    expect(response.data.list).toBeDefined();
    expect(response.data.list).toBeInstanceOf(Array);

    if(response.data.list.length > 0){
    // Assert that each item in the list has the expected properties
    response.data.list.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          id: expect.any(String),
          emailFor: expect.any(String),
          email: expect.any(Array<String>),
        })
      );
    });
  }
  });

  /**
   * Test case for the condition where the request is sent from the ISSUER to test the BadRequestException
   */
  it("should throw an error If the request is sent from the ISSUER", async () => {
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
});
