import { CassandradbService } from "@app/core/db/cassandra.service";
import { CurrentUser } from "CMS-BACK-END/src/core/middleware/current_user";
import { RequestContext } from "CMS-BACK-END/src/core/middleware/request_context";
import { Result } from "@app/feature/common/result";
import { BankBranchesDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/bank-branches.repository";
import { RolesDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/roles.repository";
import { UserChangeRequestDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user-change-request.repository";
import { UserDbRepository } from "CMS-BACK-END/src/feature/identity-access/repositories/db/user.repository";
import { AddUserUsecase } from "CMS-BACK-END/src/feature/identity-access/usecases/add-user.usecase";
import { AddUserUsecaseRequest } from "CMS-BACK-END/src/feature/identity-access/usecases/requests/add-user.usecase.request";
import { AddUserUsecaseResponse } from "CMS-BACK-END/src/feature/identity-access/usecases/response/add-user.usecase.response";
import { WorkflowGroupDbRepository } from "@app/feature/workflow/repository/db/workflow-group.repository";
import { WorkflowTasksDbRepository } from "@app/feature/workflow/repository/db/workflow-tasks.repository";

describe('AddUserUsecase', () => {
    let addUserUsecase: AddUserUsecase;
    let cassndraDbService:CassandradbService;
    let userRepository: UserDbRepository;
    let workflowDetailsRepository: WorkflowGroupDbRepository;
    let userChangeRequestRepository: UserChangeRequestDbRepository;
    let bankBranchesRepository: BankBranchesDbRepository;
    let rolesRepository: RolesDbRepository;
    let workflowTaskRepository: WorkflowTasksDbRepository;
  
    beforeEach(() => {
      userRepository = new UserDbRepository(cassndraDbService);
      workflowDetailsRepository = new WorkflowGroupDbRepository(cassndraDbService);
      userChangeRequestRepository = new UserChangeRequestDbRepository(cassndraDbService);
      bankBranchesRepository = new BankBranchesDbRepository(cassndraDbService);
      rolesRepository = new RolesDbRepository(cassndraDbService);
      workflowTaskRepository = new WorkflowTasksDbRepository(cassndraDbService);
      addUserUsecase = new AddUserUsecase(
        userRepository,
        workflowDetailsRepository,
        userChangeRequestRepository,
        bankBranchesRepository,
        rolesRepository,
        workflowTaskRepository
      );
    });
  
    it('should create a new user', async () => {
      const request: AddUserUsecaseRequest = {
        userName:"name me",
        userId:"iamdeep8888@gmail.com",
        branch:"test",
        employeeId:"EMP123",
        roles:["a","b"],
      };
      const currentUser: CurrentUser = {
        loginId: 'loggedInUserId',
        fullName:"Test User"
      };
      
      const requestContext: RequestContext = new RequestContext(currentUser);
      const expectedResponse: Result<AddUserUsecaseResponse> = Result.createSuccessWithMessage(
        new AddUserUsecaseResponse(),
        'User creation in progress'
      );
        userRepository.findById(requestContext.getCurrentUser().loginId)
        workflowDetailsRepository.findById('ICW')
        userRepository.findUsersByRoleId('a')
      const result = await addUserUsecase.execute(request, requestContext);
      expect(result).toEqual(expectedResponse);
    });
  });
  