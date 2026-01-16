import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { ChangeRequestsDbRepository } from "@app/feature/change-requests/repositories/db/change-requests.repository";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { LookupDataDbRepository } from "@app/feature/merchants-onboarding/repositories/db/lookup-data.repository";
import { OnboardRiskManagementRequestDto, TransactionVelocitySetupDto } from "@app/feature/risk-management/dtos/onboard-risk-management-request.dto";
import { RisksManagementEntity } from "@app/feature/risk-management/entities/risks-management.entity";
import { RiskTransactionVelocityEntity } from "@app/feature/risk-management/entities/risks-transaction-velocity.entity";
import { RiskTransactionVolumeEntity } from "@app/feature/risk-management/entities/risks-transaction-volume.entity";
import { RisksManagementDbRepository } from "@app/feature/risk-management/repositories/db/risks-management.repository";
import { OnboardRiskManagementUsecase } from "@app/feature/risk-management/usecases/onboard-risk-management.usecase";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";
import { WorkflowPermissionService } from "@app/feature/workflow/services/workflow-permission.service";
import { WorkflowProcessService } from "@app/feature/workflow/services/workflow-process.service";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";

describe("Onboard Risk Management Integration", () => {
  let usecase: OnboardRiskManagementUsecase;
  let datasourceService: DatasourceService;
  let data: OnboardRiskManagementRequestDto;
  let transactionVelocitySetup: any;  
  let transactionVolumeSetup: any;  

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
        OnboardRiskManagementUsecase,
        {
          provide: DatasourceService,
          useValue: datasourceService,
        },
        UserDbRepository,
        WorkflowTasksDbRepository,
        WorkflowGroupDbRepository,
        RisksManagementDbRepository,
        WorkflowProcessService,
        WorkflowPermissionService,
        ChangeRequestsDbRepository,
        LookupDataDbRepository
      ],
    }).compile();

    usecase = module.get<OnboardRiskManagementUsecase>(
      OnboardRiskManagementUsecase
    );


    defaultCurrentUser = new CurrentUser(
      "3e78f4f0-2a35-443d-8f70-4ca331d90432",
      "maker@getpay.com",
      "Maker User",
      "institution_111",
      "111",
      ["ISSUER", "ACQUIRER"]
    );

    transactionVelocitySetup = [
      {
        paymentPoint: "POS",
        paymentMode: ["CARD",'QR'],
        perMinuteTxnLimit: 100, 
        actionOnExceedPerMinuteTxnLimit: "BLOCK",
        perDayTxnLimit: 100,
        actionOnExceedPerDayTxnLimit: "BLOCK",
        perMonthTxnLimit: 1000,
        actionOnExceedPerMonthTxnLimit: "BLOCK",
        perYearTxnLimit: 10000,
        actionOnExceedPerYearTxnLimit: 'ALERT'
      },
      {
          paymentPoint: "POS",
          paymentMode: ['NFC','NFC'],
          perMinuteTxnLimit: 100, 
          actionOnExceedPerMinuteTxnLimit: "BLOCK",
          perDayTxnLimit: 100,
          actionOnExceedPerDayTxnLimit: "BLOCK",
          perMonthTxnLimit: 1000,
          actionOnExceedPerMonthTxnLimit: "BLOCK",
          perYearTxnLimit: 10000,
          actionOnExceedPerYearTxnLimit: 'ALERT'
        },
    ]

    transactionVolumeSetup = [
      {
        paymentPoint: "POS",
        paymentMode: ["CARD"],
        minAllowedAmountPerTxn: 100,
        actionOnFailMinAllowedAmountPerTxn: "BLOCK",
        maxAllowedAmountPerTxn: 1000,
        actionOnExceedMaxAllowedAmountPerTxn: "BLOCK",
        allowedTxnAmountPerDay: 100,
        actionOnExceedAllowedTxnAmountPerDay: 'BLOCK',
        allowedTxnAmountPerMonth: 10,
        actionOnExceedAllowedTxnAmountPerMonth: 'ALERT',
        allowedTxnAmountPerYear: 100,
        actionOnExceedAllowedTxnAmountPerYear: 'BLOCK'
      },
    ]


    data = new OnboardRiskManagementRequestDto(); 
    
      data.title = "Risk Management";
      data.isEnabled= true;
      data.isDefault= true; 
      data.mcc= '3137';
      data.transactionVelocitySetup= [
        {
          paymentPoint: "POS",
          paymentMode: ["CARD",'QR'],
          perMinuteTxnLimit: 100, 
          actionOnExceedPerMinuteTxnLimit: "BLOCK",
          perDayTxnLimit: 100,
          actionOnExceedPerDayTxnLimit: "BLOCK",
          perMonthTxnLimit: 1000,
          actionOnExceedPerMonthTxnLimit: "BLOCK",
          perYearTxnLimit: 10000,
          actionOnExceedPerYearTxnLimit: 'ALERT'
        },
        {
            paymentPoint: "POS",
            paymentMode: ['NFC'],
            perMinuteTxnLimit: 100, 
            actionOnExceedPerMinuteTxnLimit: "BLOCK",
            perDayTxnLimit: 100,
            actionOnExceedPerDayTxnLimit: "BLOCK",
            perMonthTxnLimit: 1000,
            actionOnExceedPerMonthTxnLimit: "BLOCK",
            perYearTxnLimit: 10000,
            actionOnExceedPerYearTxnLimit: 'ALERT'
          },
      ];
      data.transactionVolumeSetup= [
        {
          paymentPoint: "POS",
          paymentMode: ["CARD"],
          minAllowedAmountPerTxn: 100,
          actionOnFailMinAllowedAmountPerTxn: "BLOCK",
          maxAllowedAmountPerTxn: 1000,
          actionOnExceedMaxAllowedAmountPerTxn: "BLOCK",
          allowedTxnAmountPerDay: 100,
          actionOnExceedAllowedTxnAmountPerDay: 'BLOCK',
          allowedTxnAmountPerMonth: 10,
          actionOnExceedAllowedTxnAmountPerMonth: 'ALERT',
          allowedTxnAmountPerYear: 100,
          actionOnExceedAllowedTxnAmountPerYear: 'BLOCK'
        },
      ];
  });

  it("should be defined", () => {
    expect(usecase).toBeDefined();
  });

  it("should return error when the user is not an acquirer", async () => {
    defaultCurrentUser = {
      ...defaultCurrentUser,
      institutionType: ["ISSUER"],
    };
    requestContext = new RequestContext(defaultCurrentUser);
    userDefinedAls.enterWith(requestContext);

    const request = {data: data}; 
    try{ 
      await usecase.execute(request, requestContext);
    }catch(error){
      expect(error).toBeDefined(); 
      expect(error.code).toBe("-1");
      expect(error.message).toBe("ERROR");
      expect(error.errors[0].message).toBe("Sorry, you are not allowed to access this resource.");
    }
  });

  it('should give the true response on the transaction velocity setup', async () => { 

    const transactionVelocitySetupResponse = usecase.hasDuplicatePaymentMode(transactionVelocitySetup); 
    
    expect(transactionVelocitySetupResponse).toBe(true);

  });

  it('should give the false response on the transaction volume setup', async () => {

    const transactionVelocitySetupResponse = usecase.hasDuplicatePaymentMode(transactionVolumeSetup); 
    
    expect(transactionVelocitySetupResponse).toBe(false);
  });

  it('should return the value without extra space in between the title', async () => {
    const title = 'Aman     Basanta       Manish     Aayush      Nirpesh     Deep'; 

    const normalizedTitle = usecase.normalizeTitle(title);

    expect(normalizedTitle).toBe('Aman Basanta Manish Aayush Nirpesh Deep');
  });

  it("should get a repository", async () => {
    const entity = RisksManagementEntity;
    const repository = await datasourceService.getRepository(
      entity,
      defaultCurrentUser.institutionCode
    );
    expect(repository).toBeDefined();
  });

  it('should onboard the risk management', async () => {
    defaultCurrentUser = {
      ...defaultCurrentUser,
      institutionType: ["ISSUER", "ACQUIRER"],
    };
    requestContext = new RequestContext(defaultCurrentUser);
    userDefinedAls.enterWith(requestContext);

    const request = {data: data}; 

    const result = await usecase.execute(request, requestContext);
    expect(result).toBeDefined();
    expect(result.code).toBe("0");
    expect(result.message).toBe("SUCCESS");
    expect(result.data).toBeDefined();
    expect(result.data.message).toBe("Successfully onboarded Risk Management risk"); 
  });

});
