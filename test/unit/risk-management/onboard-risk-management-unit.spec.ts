import { DatasourceService } from "CMS-BACK-END/src/core/db/datasource.service";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { CoreModule } from "CMS-BACK-END/src/core/module";
import { OnboardRiskManagementRequestDto } from "@app/feature/risk-management/dtos/onboard-risk-management-request.dto";
import { RisksManagementEntity } from "@app/feature/risk-management/entities/risks-management.entity";
import { RiskTransactionVelocityEntity } from "@app/feature/risk-management/entities/risks-transaction-velocity.entity";
import { RiskTransactionVolumeEntity } from "@app/feature/risk-management/entities/risks-transaction-volume.entity";
import { RisksManagementDbRepository } from "@app/feature/risk-management/repositories/db/risks-management.repository";
import { OnboardRiskManagementUsecase } from "@app/feature/risk-management/usecases/onboard-risk-management.usecase";
import { Test, TestingModule } from "@nestjs/testing";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseTestModule } from "CMS-BACK-END/test/core/db/database.module.test";
import { AsyncLocalStorage } from "async_hooks";

// Mock entities and repositories
jest.mock("@app/feature/risk-management/entities/risks-management.entity");
jest.mock("@app/feature/risk-management/entities/risks-transaction-velocity.entity");
jest.mock("@app/feature/risk-management/entities/risks-transaction-volume.entity");
jest.mock("@app/feature/risk-management/repositories/db/risks-management.repository");

describe("Onboard Risk Management Unit Test", () => {
  let usecase: OnboardRiskManagementUsecase;
  let als: AsyncLocalStorage<RequestContext>;
  let datasourceService: DatasourceService;
  let data : OnboardRiskManagementRequestDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        CoreModule,
        DatabaseTestModule,
        TypeOrmModule.forFeature([
          RisksManagementEntity,
          RiskTransactionVelocityEntity,
          RiskTransactionVolumeEntity,
        ]), // Add the entity here
      ],
      providers: [
        OnboardRiskManagementUsecase,
        {
          provide: AsyncLocalStorage,
          useValue: new AsyncLocalStorage<RequestContext>(),
        },
        DatasourceService,
        RisksManagementDbRepository,
      ],
    }).compile();
    usecase = module.get<OnboardRiskManagementUsecase>(
      OnboardRiskManagementUsecase
    );
    datasourceService = module.get<DatasourceService>(DatasourceService);

    data = new OnboardRiskManagementRequestDto(); 
    
      data.title = "Risk Management";
      data.isEnabled= true;
      data.isDefault= true; 
      data.mcc= '123';
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

  it('should give the true response on the transaction velocity setup', async () => { 

    const transactionVelocitySetupResponse = usecase.hasDuplicatePaymentMode(data.transactionVelocitySetup); 
    
    expect(transactionVelocitySetupResponse).toBe(true);

  });

  it('should give the false response on the transaction volume setup', async () => {

    const transactionVelocitySetupResponse = usecase.hasDuplicatePaymentMode(data.transactionVolumeSetup); 
    
    expect(transactionVelocitySetupResponse).toBe(false);
  })

  it('should return the value without extra space in between the title', async () => {
    const title = 'Aman     Basanta       Manish     Aayush      Nirpesh     Deep'; 

    const normalizedTitle = usecase.normalizeTitle(title);

    expect(normalizedTitle).toBe('Aman Basanta Manish Aayush Nirpesh Deep');
  })
});

