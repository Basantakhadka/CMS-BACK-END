import { DatasourceService } from "@app/core/db/datasource.service";
import { CurrentUser } from "@app/core/middleware/current_user";
import { RequestContext } from "@app/core/middleware/request_context";
import { CoreModule } from "@app/core/module";
import { Result } from "@app/feature/common/result";
import { LookupDataEntity } from "@app/feature/merchants-onboarding/entities/lookup-data.entity";
import { LookupDataDbRepository } from "@app/feature/merchants-onboarding/repositories/db/lookup-data.repository";
import { LookupDataRepository } from "@app/feature/merchants-onboarding/repositories/lookup-data.repository";
import { GetMccCategoryListUsecase } from "@app/feature/risk-management/usecases/get-mcc-category-list.usecase";
import { GetMccCategoryListRequest } from "@app/feature/risk-management/usecases/request/get-mcc-category-list.request";
import { InstitutionCodePrefixType } from "@app/shared/constants/institution-code-prefix.constant";
import { BadRequestException } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "@test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";

describe("GetMccCategoryListUsecase", () => {
  let usecase: GetMccCategoryListUsecase;
  let lookupDataRepository: LookupDataRepository;
  let als: AsyncLocalStorage<RequestContext>;
  let datasourceService: DatasourceService; // Declare datasourceService variable
  let request: GetMccCategoryListRequest;
  let requestContext: RequestContext;
  let currentUser: CurrentUser;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
        DatabaseTestModule,
        TypeOrmModule.forFeature([LookupDataEntity]),
      ],
      providers: [
        GetMccCategoryListUsecase,
        {
          provide: AsyncLocalStorage,
          useValue: new AsyncLocalStorage<RequestContext>(),
        },
        DatasourceService,
        LookupDataDbRepository,
      ],
    }).compile();

    usecase = module.get<GetMccCategoryListUsecase>(GetMccCategoryListUsecase);
    lookupDataRepository = module.get<LookupDataRepository>(
      LookupDataDbRepository
    );
    datasourceService = module.get<DatasourceService>(DatasourceService); // Retrieve the actual DatasourceService
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

  it("should give the dropdown value for the mcc list", async () => {
    currentUser.requestedInstitutionType = "ACQUIRER";
    requestContext = new RequestContext(currentUser);

    const result = await usecase.execute(request, requestContext);

    expect(result).toBeDefined();
    expect(result).toBeInstanceOf(Result);
    expect(result.code).toBe("0");
    expect(result.message).toBe("SUCCESS");
    expect(result.data).toBeDefined();
    expect(result.data.list).toBeDefined();
    expect(result.data.list).toBeInstanceOf(Array);

    // Assert that each item in the list has the expected properties
    result.data.list.forEach((item: any) => {
      expect(item).toEqual(
        expect.objectContaining({
          name: expect.any(String),
          title: expect.any(String),
          value: expect.any(String),
        })
      );
    });
  }); // Test case for the condition where the request is sent from the ACQUIRER

  it("should get a repository", async () => {
    const entity = LookupDataEntity;
    const repository = await datasourceService.getRepository(
      entity,
      InstitutionCodePrefixType.getSchema("111")
    );
    expect(repository).toBeDefined();
  }); // Test case for the getRepository method

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
  }); // Test case for the condition where the request is sent from the ISSUER
});
