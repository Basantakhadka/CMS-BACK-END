import { PermissionPointEnumType } from "./permission-enum-type.constant";

export class PermissionsConstant extends PermissionPointEnumType<PermissionsConstant>{
    public static readonly LOGIN = new PermissionsConstant('/auth/login', 'POST', []);
    public static readonly DASHBOARD_REPORTS_TRANSACTIONS_COUNT = new PermissionsConstant('/dashboard-reports/transactions/count/:period', 'GET', ['dashboard:transactions']);
    public static readonly DASHBOARD_REPORTS_MERCHANTS_COUNT = new PermissionsConstant('/dashboard-reports/merchants/count/:period', 'GET', ['dashboard:merchants']);
    public static readonly DASHBOARD_REPORTS_REPORTS_PAYMENT_POINTS_ADDED_COUNT = new PermissionsConstant('/dashboard-reports/payment-points-added/count/:period', 'GET', ['dashboard:paymentPoints']);
    public static readonly DASHBOARD_REPORTS_TRANSACTIONS_BAR_COUNT = new PermissionsConstant('/dashboard-reports/transactions-bar/count/:period', 'GET', ['dashboard:transactionGraph']);
    public static readonly DASHBOARD_REPORTS_TRANSACTIONS_BAR_AMOUNT = new PermissionsConstant('/dashboard-reports/transactions-bar/amount/:period', 'GET', ['dashboard:transactionGraph']);
    public static readonly DASHBOARD_REPORTS_TRANSACTIONS_AMOUNT = new PermissionsConstant('/dashboard-reports/transactions/amount/:period', 'GET', ['dashboard:transactionAmount']);
    public static readonly DASHBOARD_REPORTS_NOTIFICATION = new PermissionsConstant('/dashboard-reports/my-notifications', 'GET', []);
    public static readonly TRANSACTIONS_ALL_LIST = new PermissionsConstant('/transactions/all/list', 'POST', ['transactions:all:table']);
    public static readonly TRANSACTIONS_MONTH_LIST = new PermissionsConstant('/transactions/month/list', 'POST', ['transactions:month:table']);
    public static readonly TRANSACTIONS_TODAY_LIST = new PermissionsConstant('/transactions/today/list', 'POST', ['transactions:today:table']);
    public static readonly TRANSACTIONS_TOTAL_COUNT = new PermissionsConstant('/transactions/total-count', 'GET', ['transactions:today:table', 'transactions:month:table', 'transactions:all:table']);
    public static readonly TRANSACTIONS_ALL_SUMMARY_COUNT_PAYMENT_POINT = new PermissionsConstant('/transactions/summary/count/all/payment-point', 'POST', ['transactions:all:summary']);
    public static readonly TRANSACTIONS_MONTH_SUMMARY_COUNT_PAYMENT_POINT = new PermissionsConstant('/transactions/summary/count/month/payment-point', 'POST', ['transactions:month:summary']);
    public static readonly TRANSACTIONS_TODAY_SUMMARY_COUNT_PAYMENT_POINT = new PermissionsConstant('/transactions/summary/count/today/payment-point', 'POST', ['transactions:today:summary']);
    public static readonly TRANSACTIONS_ALL_COUNT_BY_FILTER = new PermissionsConstant('/transactions/all/count-by-filter', 'POST', ['transactions:all:table']);
    public static readonly TRANSACTIONS_MONTH_COUNT_BY_FILTER = new PermissionsConstant('/transactions/month/count-by-filter', 'POST', ['transactions:month:table']);
    public static readonly TRANSACTIONS_TODAY_COUNT_BY_FILTER = new PermissionsConstant('/transactions/today/count-by-filter', 'POST', ['transactions:today:table']);
    public static readonly TRANSACTIONS_ALL_TOTAL_SUM = new PermissionsConstant('/transactions/all/total-sum', 'POST', ['transactions:all:table']);
    public static readonly TRANSACTIONS_MONTH_TOTAL_SUM = new PermissionsConstant('/transactions/month/total-sum', 'POST', ['transactions:month:table']);
    public static readonly TRANSACTIONS_TODAY_TOTAL_SUM = new PermissionsConstant('/transactions/today/total-sum', 'POST', ['transactions:today:table']);
    public static readonly SINGLE_TRANSACTION = new PermissionsConstant('/transactions/single-transaction', 'POST', ['transactions:today:table', 'transactions:month:table', 'transactions:all:table']);
    public static readonly IDENTITY_ACCESS_USERS_LIST = new PermissionsConstant('/identity-access/users/list', 'POST', ['iam:users:users']);
    public static readonly IDENTITY_ACCESS_USER_CHANGE_REQUESTS_LIST = new PermissionsConstant('/identity-access/user-change-requests/list', 'POST', ['iam:users:changeRequests']);
    public static readonly IDENTITY_ACCESS_SINGLE_USERS_LIST = new PermissionsConstant('/identity-access/users/:id', 'GET', []);
    public static readonly IDENTITY_ACCESS_SINGLE_USER_CHANGE_REQUESTS_LIST = new PermissionsConstant('/identity-access/user-change-requests/:id', 'POST', []);
    public static readonly APPROVE_IDENTITY_ACCESS_USER_CHANGE_REQUESTS = new PermissionsConstant('/identity-access/user-change-requests/:id/approve', 'POST', []);
    public static readonly IDENTITY_ACCESS_CREATE_USERS = new PermissionsConstant('/identity-access/users', 'POST', []);
    public static readonly IDENTITY_ACCESS_APPROVE_USERS = new PermissionsConstant('/identity-access/user/users-changes/:refId/:id/approve', 'POST', []);
    public static readonly IDENTITY_ACCESS_REJECT_USERS = new PermissionsConstant('/identity-access/user/users-changes/:refId/:id/reject', 'POST', []);
    public static readonly IDENTITY_ACCESS_USERS_TOTAL_COUNT = new PermissionsConstant('/identity-access/users-total-count', 'POST', ['iam:users:users']);
    public static readonly IDENTITY_ACCESS_DELETE_USERS = new PermissionsConstant('/identity-access/users/:id', 'DELETE', []);
    public static readonly IDENTITY_ACCESS_UPDATE_USERS = new PermissionsConstant('/identity-access/users/:id', 'PUT', []);
    public static readonly IDENTITY_ACCESS_ROLES_LIST = new PermissionsConstant('/identity-access/roles/list', 'POST', ['iam:roles:roles']);
    public static readonly IDENTITY_ACCESS_SINGLE_ROLES_LIST = new PermissionsConstant('/identity-access/roles/:id', 'GET', []);
    public static readonly IDENTITY_ACCESS_ROLES_CHANGE_REQUESTS_LIST = new PermissionsConstant('/identity-access/roles-change-requests', 'POST', ['iam:roles:changeRequests']);
    public static readonly IDENTITY_ACCESS_VIEW_ROLES_CHANGE_REQUEST = new PermissionsConstant('/identity-access/roles-change-requests/:id', 'POST', []);
    public static readonly IDENTITY_ACCESS_ROLES_TOTAL_COUNT = new PermissionsConstant('/identity-access/roles-total-count', 'GET', ['iam:roles:roles']);
    public static readonly IDENTITY_ACCESS_ROLES_PERMISSIONS_UI = new PermissionsConstant('/identity-access/roles-permissionsui', 'GET', []);
    public static readonly IDENTITY_ACCESS_ROLES_CHANGE_REQUEST_TOTAL_COUNT = new PermissionsConstant('/identity-access/roles-change-request/total-count', 'GET', ['iam:roles:changeRequests']);
    public static readonly IDENTITY_ACCESS_CREATE_ROLES = new PermissionsConstant('/identity-access/roles', 'POST', []);
    public static readonly IDENTITY_ACCESS_REJECT_ROLES = new PermissionsConstant('/identity-access/role/roles-changes/:refId/:id/reject', 'PUT', []);
    public static readonly IDENTITY_ACCESS_APPROVE_ROLES = new PermissionsConstant('/identity-access/role/roles-changes/:refId/:id/approve', 'PUT', []);
    public static readonly IDENTITY_ACCESS_REVERT_ROLES = new PermissionsConstant('/identity-access/role/roles-changes/:refId/:id/revert', 'PUT', []);
    public static readonly IDENTITY_ACCESS_MODIFY_ROLES = new PermissionsConstant('/identity-access/role/roles-changes/:refId/:id/modify', 'PUT', []);
    public static readonly IDENTITY_ACCESS_SINGLE_ROLES_CHANGE_REQUEST_LIST = new PermissionsConstant('/identity-access/roles-changes/:refId/:id', 'GET', []);
    public static readonly IDENTITY_ACCESS_UPDATE_ROLES = new PermissionsConstant('/identity-access/roles/:id', 'PUT', []);
    public static readonly IDENTITY_ACCESS_DELETE_ROLES = new PermissionsConstant('/identity-access/roles/:id', 'DELETE', []);
    public static readonly IDENTITY_ACCESS_ADD_UPDATE_GENERAL_POLICY = new PermissionsConstant('/identity-access/general-policy', 'POST', []);
    public static readonly IDENTITY_ACCESS_USER_ROLES_SELECT_MENU = new PermissionsConstant('/identity-access/role-users-select-menu/:id', 'POST', []);
    public static readonly MERCHANTS_APPLICATIONS_CREATE_OUTLET_DETAILS = new PermissionsConstant('/merchants/applications/:application_id/outlets', 'POST', []);    
    public static readonly MERCHANTS_APPLICATIONS_CREATE_PAP_DETAILS_OF_OUTLET = new PermissionsConstant('/merchants/applications/:application_id/outlets/:outlet_id/payment-accepting-point', 'POST', []);    
    public static readonly MERCHANTS_APPLICATIONS_UPDATE_PAP_DETAILS = new PermissionsConstant('/merchants/applications/:application_id/outlets', 'PUT', []);    
    public static readonly MERCHANTS_APPLICATIONS_OUTLETS_LIST = new PermissionsConstant('/merchants/applications/:application_id/outlets', 'GET', []);    
    public static readonly MERCHANTS_APPLICATIONS_SINGLE_OUTLET = new PermissionsConstant('/merchants/applications/:application_id/outlets/:outlet_id', 'GET', []);    
    public static readonly MERCHANTS_APPLICATIONS_PAP_BY_OUTLET_LIST = new PermissionsConstant('/merchants/applications/:application_id/outlets/:outlet_id/payment-accepting-points', 'POST', []);    
    public static readonly MERCHANTS_APPLICATION_DELETE_OUTLET = new PermissionsConstant('/merchants/application/:applicationId/outlet/:outletId', 'DELETE', []);
    public static readonly MERCHANTS_APPLICATION_DELETE_PAP = new PermissionsConstant('/merchants/application/:applicationId/outlet/:outletId/pap/:papId', 'DELETE', []);
    public static readonly MERCHANTS_APPLICATIONS_LIST = new PermissionsConstant('/merchants/applications', 'POST', ['merchants:applications:table']);
    public static readonly MERCHANTS_APPLICATION_PAP_BY_OUTLET_TOTAL_COUNT = new PermissionsConstant('/merchants/application/:applicationId/outlet/:outletId/payment-accepting-point/total-count', 'GET', []);
    public static readonly MERCHANTS_APPLICATIONS_TOTAL_COUNT = new PermissionsConstant('/merchants/total-count', 'GET', ['merchants:applications:table', 'merchants:enrolled:table', 'merchants:changeRequests']);
    public static readonly MERCHANTS_ENROLLED_LIST = new PermissionsConstant('/merchants/enrolled', 'POST', ['merchants:enrolled:table']);
    public static readonly MERCHANTS_APPLICATIONS_DOUGHNUT_CHART_SUMMARY = new PermissionsConstant('/merchants/applications/summary/by-status', 'GET', ['merchants:applications:summary']);
    public static readonly MERCHANTS_ENROLLED_DOUGHNUT_CHART_SUMMARY = new PermissionsConstant('/merchants/enrolled/count-by-status', 'POST', ['merchants:enrolled:summary']);
    public static readonly MERCHANTS_CHANGE_REQUESTS_LIST = new PermissionsConstant('/merchants/change-requests', 'POST', ['merchants:changeRequests']);
    public static readonly MERCHANTS_APPLICATION_APPLY = new PermissionsConstant('/merchants/application-apply/:id', 'POST', ['merchants:changeRequests']);
    public static readonly MERCHANTS_APPLICATION_APPROVE = new PermissionsConstant('/merchants/application/:id/approve', 'POST', ['merchants:changeRequests']);
    public static readonly MERCHANTS_APPLICATION_REVERT = new PermissionsConstant('/merchants/application/:id/revert', 'POST', ['merchants:changeRequests']);
    public static readonly MERCHANTS_APPLICATION_DELETE = new PermissionsConstant('/merchants/applications/:id/delete', 'DELETE', ['merchants:changeRequests']);
    public static readonly MERCHANTS_APPLICATION_REJECT = new PermissionsConstant('/merchants/application/:id/reject', 'POST', ['merchants:changeRequests']);
    public static readonly MERCHANTS_APPLICATION_CHANGE_REQUEST_MESSAGE = new PermissionsConstant('/merchants/application/:id/change-request-message', 'GET', ['merchants:changeRequests']);    
    public static readonly ONBOARDING_MERCHANTS_UNIQUE_ID = new PermissionsConstant('/onboarding/merchants/application/unique-id', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_GENERAL_INFO_DETAILS = new PermissionsConstant('/onboarding/merchants/application/general-info', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_ADD_UPDATE_GENERAL_INFO = new PermissionsConstant('/onboarding/merchants/application/general-info', 'POST', []);
    public static readonly ONBOARDING_MERCHANTS_APPLICATION_GENERAL_INFO = new PermissionsConstant('/onboarding/merchants/:applicationId/general-info', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_ADD_PAYMENT_ACCEPT_POINTS = new PermissionsConstant('/onboarding/merchants/application/payment-accept-points', 'POST', []);
    public static readonly ONBOARDING_MERCHANTS_BUSINESS_DETAILS = new PermissionsConstant('/onboarding/merchants/:applicationId/business-details', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_ADD_UPDATE_BUSINESS_DETAILS = new PermissionsConstant('/onboarding/merchants/application/business-details', 'POST', []);
    public static readonly ONBOARDING_MERCHANTS_BUSINESS_CATEGORY = new PermissionsConstant('/onboarding/merchants/business-category', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_SAVE_ONBOARDING_PROGRESS = new PermissionsConstant('/onboarding/merchants/save-onboarding-progress', 'POST', []);
    public static readonly ONBOARDING_MERCHANTS_ONBOARDING_PROGRESS = new PermissionsConstant('/onboarding/merchants/onboarding-progress/:id', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_OWNERS_DETAILS = new PermissionsConstant('/onboarding/merchants/:applicationId/owners-details', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_SINGLE_OWNER_DETAILS = new PermissionsConstant('/onboarding/merchants/:applicationId/:ownersId/owners-details', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_ADD_OWNER_DETAILS = new PermissionsConstant('/onboarding/merchants/application/owners-details', 'POST', []);
    public static readonly ONBOARDING_MERCHANTS_DELETE_OWNER = new PermissionsConstant('/onboarding/merchants/:applicationId/:ownersId/owners-details', 'DELETE', []);
    public static readonly ONBOARDING_MERCHANTS_BANK_DETAILS = new PermissionsConstant('/onboarding/merchants/:applicationId/bank-details', 'GET', []);
    public static readonly ONBOARDING_BANKS_WITH_BRANCHES = new PermissionsConstant('/onboarding/banks', 'GET', []);
    public static readonly ONBOARDING_MERCHANTS_ADD_UPDATE_BANK_DETAILS = new PermissionsConstant('/onboarding/merchants/application/bank-details', 'POST', []);
    public static readonly ONBOARDING_MERCHANTS_CONTACT_DETAILS = new PermissionsConstant('/onboarding/merchants/applications/:applicationId/contact-details', 'GET', [ 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANT_DESIGNATION = new PermissionsConstant('/onboarding/merchant/designation', 'GET', [, 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_ADD_UPDATE_CONTACT_DETAILS = new PermissionsConstant('/onboarding/merchants/applications/contact-details', 'POST', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_FILE_UPLOADABLE_URL = new PermissionsConstant('/onboarding/merchants/file/get-uploadable-url', 'GET', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_UPLOAD_COMPANY_DOCUMENTS = new PermissionsConstant('/onboarding/merchants/application/company-documents', 'PUT', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_ADD_UPDATE_COMPANY_DOCUMENTS = new PermissionsConstant('/onboarding/merchants/application/company-documents', 'POST', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_UPLOAD_OWNERS_DOCUMENTS = new PermissionsConstant('/onboarding/merchants/application/owners-documents', 'PUT', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_ADD_UPDATE_OWNERS_DOCUMENTS = new PermissionsConstant('/onboarding/merchants/application/owners-documents', 'POST', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_COMPANY_DOCUMENTS = new PermissionsConstant('/onboarding/merchants/application/:id/company-documents', 'GET', [ 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANTS_OWNER_DOCUMENTS = new PermissionsConstant('/onboarding/merchants/application/:app_id/owner-documents/:o_id', 'GET', [ 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANT_COUNTRY_DETAILS_DROPDOWN = new PermissionsConstant('/onboarding/merchant/country-details', 'GET', [ 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANT_ALL_COUNTRIES_DROPDOWN = new PermissionsConstant('/onboarding/merchant/all-countries', 'GET', [ 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANT_ADDRESS_DROPDOWN = new PermissionsConstant('/onboarding/merchant/address', 'POST', ['merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANT_VALIDATE_DOCUMENTS = new PermissionsConstant('/onboarding/merchant/:id/validate-documents', 'POST', [ 'merchants:changeRequests']);
    public static readonly ONBOARDING_MERCHANT_APPLICATION_SUMMARY = new PermissionsConstant('/onboarding/merchant/:id/summary', 'POST', ['merchants:enrolled:summary', 'merchants:applications:summary']);
    public static readonly IDENTITY_ACCESS_BRANCHES_SELECT_MENU = new PermissionsConstant('/identity-access/branches-select-menu', 'POST', []);
    public static readonly IDENTITY_ACCESS_ROLES_SELECT_MENU = new PermissionsConstant('/identity-access/roles-select-menu', 'POST', []);

  
    public static readonly SERVICE_FEES_PAYMENT_LOCATION_DROPDOWN = new PermissionsConstant('/service-fees/payment-location', 'GET', []);
    public static readonly SERVICE_FEES_PAYMENT_MODE_DROPDOWN = new PermissionsConstant('/service-fees/payment-mode', 'GET', []);
    public static readonly SERVICE_FEES_TRANSACTION_TYPE_DROPDOWN = new PermissionsConstant('/service-fees/transaction-type', 'GET', []);
    public static readonly SERVICE_FEES_APPLICABLE_TYPE_DROPDOWN = new PermissionsConstant('/service-fees/applicable-type', 'GET', []);
    public static readonly SERVICE_FEES_MCC_CODE_CATEGORY = new PermissionsConstant('/service-fees/mcc-code-category', 'GET', []);
  public static readonly SERVICE_FEES_PAYMENT_NETWORKS_BY_PAYMENTMODES = new PermissionsConstant('/service-fees/payment-networks/:paymentModes', 'GET', []);
  


    public static readonly ADD_SERVICE_FEES_DETAILS = new PermissionsConstant('/service-fees/', 'POST', []);

  
    public static readonly SERVICE_FEES_TITLE_BY_MCC_LIST = new PermissionsConstant('/service-fees/:mcc', 'GET', []);
    public static readonly SERVICE_FEES_BY_MCC_AND_ID_LIST = new PermissionsConstant('/service-fees/:mcc/:id', 'GET', []);
    public static readonly UPDATE_SERVICE_FEES = new PermissionsConstant('/service-fees/:mcc/:id', 'PUT', []);
    public static readonly DELETE_SERVICE_FEES = new PermissionsConstant('/service-fees/:mcc/:id', 'DELETE', []);
    public static readonly ADD_SERVICE_FEES_CHANGE_REQUEST = new PermissionsConstant('/service-fees/msf', 'POST', []);
    public static readonly SERVICE_FEES_CHANGE_REQUEST = new PermissionsConstant('/service-fees/msf-changes', 'POST', []);
    public static readonly SERVICE_FEES_CHANGES_REQUEST_LIST_COUNT = new PermissionsConstant('/service-fees/msf-changes/list/count', 'GET', []);
    public static readonly SERVICE_FEES_CHANGES_REQUEST_COMPARISION = new PermissionsConstant('/service-fees/msf-changes/:refId/:id', 'GET', []);
    public static readonly REVIEW_SERVICE_FEES_CHANGES_REQUEST = new PermissionsConstant('/service-fees/msf-changes/:refid/:id/review', 'PUT', []);
    public static readonly SERVICE_FEES_CHANGES_REQUEST_TO_EDIT = new PermissionsConstant('/service-fees/msf-changes/:refId/:id/edit', 'GET', []);
    public static readonly EDIT_SERVICE_FEES_MSF_CHANGES_REQUEST = new PermissionsConstant('/service-fees/msf-changes/:refId/:id', 'PUT', []);
    public static readonly APPROVE_SERVICE_FEES_MSF_CHANGES_REQUEST = new PermissionsConstant('/service-fees/msf-changes/:refid/:id/approve', 'POST', []);
    public static readonly REJECT_SERVICE_FEES_MSF_CHANGES_REQUEST = new PermissionsConstant('/service-fees/msf-changes/:refid/:id/reject', 'PUT', []);
  public static readonly REVERT_SERVICE_FEES_MSF_CHANGES_REQUEST = new PermissionsConstant('/service-fees/msf-changes/:refid/:id/revert', 'PUT', []);
  

    public static readonly WORKFLOW_ONBOARDING_ADD_PROCESS = new PermissionsConstant('/workflow/onboarding/add-process', 'POST', []);
    public static readonly WORKFLOW_ONBOARDING_DELETE_WORKFLOW_DETAIL = new PermissionsConstant('/workflow/onboarding/delete-workflow-detail', 'DELETE', []);
    public static readonly WORKFLOW_ONBOARDING_WORKFLOW_DETAILS_LIST = new PermissionsConstant('/workflow/onboarding/workflow-details', 'POST', []);
    public static readonly WORKFLOW_ONBOARDING_UPDATE_WORKFLOW_DETAIL = new PermissionsConstant('/workflow/onboarding/update-workflow-detail', 'PUT', []);
    public static readonly WORKFLOW_ONBOARDING_SINGLE_WORKFLOW = new PermissionsConstant('/workflow/get-workflows', 'POST', []);
    public static readonly UPDATE_WORKFLOW_ONBOARDING_WORKFLOW_GROUP = new PermissionsConstant('/workflow/update-workflow-group', 'POST', []);
    public static readonly INITIATE_TRANSACTIONS_DISPUTES= new PermissionsConstant('/transactions-disputes', 'POST', []);
    public static readonly TRANSACTIONS_DISPUTES_CATEGORY_DROPDOWN = new PermissionsConstant('/transactions-disputes/dropdown/category', 'GET', []);
    public static readonly TRANSACTIONS_DISPUTES_LIST = new PermissionsConstant('/transactions-disputes/list', 'POST', []);
    public static readonly TRANSACTIONS_DISPUTES_TOTAL_COUNT = new PermissionsConstant('/transactions-disputes/total/count', 'GET', []);
    public static readonly TRANSACTIONS_DISPUTES_DONUT_CHART_SUMMARY = new PermissionsConstant('/transactions-disputes/donut-chart', 'GET', []);
    public static readonly VIEW_TRANSACTIONS_DISPUTE = new PermissionsConstant('/transactions-disputes/:id', 'GET', []);
    public static readonly RESOLVE_TRANSACTIONS_DISPUTES = new PermissionsConstant('/transactions-disputes/:id/resolve', 'POST', []);
    public static readonly TRANSACTIONS_DISPUTES_FILE_UPLOADABLE_URL = new PermissionsConstant('/transactions-disputes/file/upload-url', 'GET', []);
    public static readonly TRANSACTIONS_DISPUTES_PROOFS = new PermissionsConstant('/transactions-disputes/:id/proofs', 'POST', []);
  public static readonly TEST = new PermissionsConstant('/transactions/test', 'GET', []);
  

    public static readonly MERCHANT_ONBOARDING_APPLICATIONS = new PermissionsConstant('/merchant-onboarding/applications', 'POST', ["merchants:applications:table"]);
    public static readonly MERCHANT_ONBOARDING_SUMMARY = new PermissionsConstant('/merchant-onboarding/applications/summary/by-status', 'GET', ["merchants:applications:summary"]);
  public static readonly SERVICE_FEES_MSF_LIST_COUNT = new PermissionsConstant('/service-fees/msf-list/count', 'POST', ["serviceFee:merchantServiceFee"]);
    public static readonly SERVICE_FEES_MSF_LIST = new PermissionsConstant('/service-fees/msf-list', 'POST', ["serviceFee:merchantServiceFee"]);
  public static readonly AUDIT_LOGS_LIST = new PermissionsConstant('/audit-log/msf-list', 'POST', ["auditLog:List"]);
  public static readonly AUDIT_LOGS_LIST_COUNT = new PermissionsConstant('/audit-log/msf/total-count.', 'POST', ["auditLog:List"]);
  public static readonly NETWORK_PROCESSOR_LIST = new PermissionsConstant('/network-processor/list', 'POST', ["networkProcessor:networkProcessorList"]);
    public static readonly WORKFLOW_ONBOARDING_ALL_WORKFLOW_GROUP_LIST = new PermissionsConstant('/workflow/get-workflow-group', 'GET', ["workflow"]);
    public static readonly IDENTITY_ACCESS_GET_GENERAL_POLICY = new PermissionsConstant('/identity-access/general-policy', 'GET', ["iam:general:passwordPolicy"]);
  public static readonly SYSTEM_CONFIGURATION_LIST = new PermissionsConstant('/system-configuration/merchant-activation-status', 'GET', ["systemConfig:merchantConfig","systemConfig:merchantConfig:bypassActivation"]);
    private constructor(public readonly endpoint: string, public readonly method: string, public readonly permissions:Array<string>) {
        super(endpoint);
        this.method = method;
        this.permissions = permissions;
    }

    public static getValues(): PermissionsConstant[]{
        return [
					this.LOGIN,
					this.DASHBOARD_REPORTS_TRANSACTIONS_COUNT,
					this.DASHBOARD_REPORTS_MERCHANTS_COUNT,
					this.DASHBOARD_REPORTS_REPORTS_PAYMENT_POINTS_ADDED_COUNT,
					this.DASHBOARD_REPORTS_TRANSACTIONS_BAR_COUNT,
					this.DASHBOARD_REPORTS_TRANSACTIONS_BAR_AMOUNT,
					this.DASHBOARD_REPORTS_TRANSACTIONS_AMOUNT,
					this.DASHBOARD_REPORTS_NOTIFICATION,
					this.TRANSACTIONS_ALL_LIST,
					this.TRANSACTIONS_MONTH_LIST,
					this.TRANSACTIONS_TODAY_LIST,
					this.TRANSACTIONS_TOTAL_COUNT,
					this.TRANSACTIONS_ALL_SUMMARY_COUNT_PAYMENT_POINT,
					this.TRANSACTIONS_MONTH_SUMMARY_COUNT_PAYMENT_POINT,
					this.TRANSACTIONS_TODAY_SUMMARY_COUNT_PAYMENT_POINT,
					this.TRANSACTIONS_ALL_COUNT_BY_FILTER,
					this.TRANSACTIONS_MONTH_COUNT_BY_FILTER,
					this.TRANSACTIONS_TODAY_COUNT_BY_FILTER,
					this.TRANSACTIONS_ALL_TOTAL_SUM,
					this.TRANSACTIONS_MONTH_TOTAL_SUM,
					this.TRANSACTIONS_TODAY_TOTAL_SUM,
					this.SINGLE_TRANSACTION,
					this.IDENTITY_ACCESS_USERS_LIST,
					this.IDENTITY_ACCESS_USER_CHANGE_REQUESTS_LIST,
					this.IDENTITY_ACCESS_SINGLE_USERS_LIST,
					this.IDENTITY_ACCESS_SINGLE_USER_CHANGE_REQUESTS_LIST,
					this.APPROVE_IDENTITY_ACCESS_USER_CHANGE_REQUESTS,
					this.IDENTITY_ACCESS_CREATE_USERS,
					this.IDENTITY_ACCESS_APPROVE_USERS,
					this.IDENTITY_ACCESS_REJECT_USERS,
					this.IDENTITY_ACCESS_USERS_TOTAL_COUNT,
					this.IDENTITY_ACCESS_DELETE_USERS,
					this.IDENTITY_ACCESS_UPDATE_USERS,
					this.IDENTITY_ACCESS_ROLES_LIST,
					this.IDENTITY_ACCESS_SINGLE_ROLES_LIST,
					this.IDENTITY_ACCESS_ROLES_CHANGE_REQUESTS_LIST,
					this.IDENTITY_ACCESS_ROLES_TOTAL_COUNT,
					this.IDENTITY_ACCESS_ROLES_PERMISSIONS_UI,
					this.IDENTITY_ACCESS_ROLES_CHANGE_REQUEST_TOTAL_COUNT,
					this.IDENTITY_ACCESS_CREATE_ROLES,
					this.IDENTITY_ACCESS_REJECT_ROLES,
					this.IDENTITY_ACCESS_APPROVE_ROLES,
					this.IDENTITY_ACCESS_SINGLE_ROLES_CHANGE_REQUEST_LIST,
					this.IDENTITY_ACCESS_UPDATE_ROLES,
					this.IDENTITY_ACCESS_DELETE_ROLES,
					this.IDENTITY_ACCESS_GET_GENERAL_POLICY,
					this.IDENTITY_ACCESS_ADD_UPDATE_GENERAL_POLICY,
					this.IDENTITY_ACCESS_USER_ROLES_SELECT_MENU,
					this.MERCHANTS_APPLICATIONS_CREATE_OUTLET_DETAILS,
					this.MERCHANTS_APPLICATIONS_CREATE_PAP_DETAILS_OF_OUTLET,
					this.MERCHANTS_APPLICATIONS_UPDATE_PAP_DETAILS,
					this.MERCHANTS_APPLICATIONS_OUTLETS_LIST,
					this.MERCHANTS_APPLICATIONS_SINGLE_OUTLET,
					this.MERCHANTS_APPLICATIONS_PAP_BY_OUTLET_LIST,
					this.MERCHANTS_APPLICATION_DELETE_OUTLET,
					this.MERCHANTS_APPLICATION_DELETE_PAP,
					this.MERCHANTS_APPLICATIONS_LIST,
					this.MERCHANTS_APPLICATION_PAP_BY_OUTLET_TOTAL_COUNT,
					this.MERCHANTS_APPLICATIONS_TOTAL_COUNT,
					this.MERCHANTS_ENROLLED_LIST,
					this.MERCHANTS_APPLICATIONS_DOUGHNUT_CHART_SUMMARY,
					this.MERCHANTS_ENROLLED_DOUGHNUT_CHART_SUMMARY,
					this.MERCHANTS_CHANGE_REQUESTS_LIST,
					this.MERCHANTS_APPLICATION_APPLY,
					this.MERCHANTS_APPLICATION_APPROVE,
					this.MERCHANTS_APPLICATION_REVERT,
					this.MERCHANTS_APPLICATION_DELETE,
					this.MERCHANTS_APPLICATION_REJECT,
					this.MERCHANTS_APPLICATION_CHANGE_REQUEST_MESSAGE,
					this.ONBOARDING_MERCHANTS_UNIQUE_ID,
					this.ONBOARDING_MERCHANTS_GENERAL_INFO_DETAILS,
					this.ONBOARDING_MERCHANTS_ADD_UPDATE_GENERAL_INFO,
					this.ONBOARDING_MERCHANTS_APPLICATION_GENERAL_INFO,
					this.ONBOARDING_MERCHANTS_ADD_PAYMENT_ACCEPT_POINTS,
					this.ONBOARDING_MERCHANTS_BUSINESS_DETAILS,
					this.ONBOARDING_MERCHANTS_ADD_UPDATE_BUSINESS_DETAILS,
					this.ONBOARDING_MERCHANTS_BUSINESS_CATEGORY,
					this.ONBOARDING_MERCHANTS_SAVE_ONBOARDING_PROGRESS,
					this.ONBOARDING_MERCHANTS_ONBOARDING_PROGRESS,
					this.ONBOARDING_MERCHANTS_OWNERS_DETAILS,
					this.ONBOARDING_MERCHANTS_SINGLE_OWNER_DETAILS,
					this.ONBOARDING_MERCHANTS_ADD_OWNER_DETAILS,
					this.ONBOARDING_MERCHANTS_DELETE_OWNER,
					this.ONBOARDING_MERCHANTS_BANK_DETAILS,
					this.ONBOARDING_BANKS_WITH_BRANCHES,
					this.ONBOARDING_MERCHANTS_ADD_UPDATE_BANK_DETAILS,
					this.ONBOARDING_MERCHANTS_CONTACT_DETAILS,
					this.ONBOARDING_MERCHANT_DESIGNATION,
					this.ONBOARDING_MERCHANTS_ADD_UPDATE_CONTACT_DETAILS,
					this.ONBOARDING_MERCHANTS_FILE_UPLOADABLE_URL,
					this.ONBOARDING_MERCHANTS_UPLOAD_COMPANY_DOCUMENTS,
					this.ONBOARDING_MERCHANTS_ADD_UPDATE_COMPANY_DOCUMENTS,
					this.ONBOARDING_MERCHANTS_UPLOAD_OWNERS_DOCUMENTS,
					this.ONBOARDING_MERCHANTS_ADD_UPDATE_OWNERS_DOCUMENTS,
					this.ONBOARDING_MERCHANTS_COMPANY_DOCUMENTS,
					this.ONBOARDING_MERCHANTS_OWNER_DOCUMENTS,
					this.ONBOARDING_MERCHANT_COUNTRY_DETAILS_DROPDOWN,
					this.ONBOARDING_MERCHANT_ALL_COUNTRIES_DROPDOWN,
					this.ONBOARDING_MERCHANT_ADDRESS_DROPDOWN,
					this.ONBOARDING_MERCHANT_VALIDATE_DOCUMENTS,
					this.ONBOARDING_MERCHANT_APPLICATION_SUMMARY,
					this.IDENTITY_ACCESS_BRANCHES_SELECT_MENU,
					this.IDENTITY_ACCESS_ROLES_SELECT_MENU,
					this.SERVICE_FEES_PAYMENT_LOCATION_DROPDOWN,
					this.SERVICE_FEES_PAYMENT_MODE_DROPDOWN,
					this.SERVICE_FEES_TRANSACTION_TYPE_DROPDOWN,
					this.SERVICE_FEES_APPLICABLE_TYPE_DROPDOWN,
					this.SERVICE_FEES_MCC_CODE_CATEGORY,
					this.SERVICE_FEES_PAYMENT_NETWORKS_BY_PAYMENTMODES,
					this.ADD_SERVICE_FEES_DETAILS,
					this.SERVICE_FEES_MSF_LIST_COUNT,
					this.SERVICE_FEES_TITLE_BY_MCC_LIST,
					this.SERVICE_FEES_BY_MCC_AND_ID_LIST,
					this.SERVICE_FEES_MSF_LIST,
					this.UPDATE_SERVICE_FEES,
					this.DELETE_SERVICE_FEES,
					this.ADD_SERVICE_FEES_CHANGE_REQUEST,
					this.SERVICE_FEES_CHANGE_REQUEST,
					this.SERVICE_FEES_CHANGES_REQUEST_LIST_COUNT,
					this.SERVICE_FEES_CHANGES_REQUEST_COMPARISION,
					this.REVIEW_SERVICE_FEES_CHANGES_REQUEST,
					this.SERVICE_FEES_CHANGES_REQUEST_TO_EDIT,
					this.EDIT_SERVICE_FEES_MSF_CHANGES_REQUEST,
					this.APPROVE_SERVICE_FEES_MSF_CHANGES_REQUEST,
					this.REJECT_SERVICE_FEES_MSF_CHANGES_REQUEST,
					this.REVERT_SERVICE_FEES_MSF_CHANGES_REQUEST,
					this.WORKFLOW_ONBOARDING_ADD_PROCESS,
					this.WORKFLOW_ONBOARDING_DELETE_WORKFLOW_DETAIL,
					this.WORKFLOW_ONBOARDING_WORKFLOW_DETAILS_LIST,
					this.WORKFLOW_ONBOARDING_UPDATE_WORKFLOW_DETAIL,
					this.WORKFLOW_ONBOARDING_ALL_WORKFLOW_GROUP_LIST,
					this.WORKFLOW_ONBOARDING_SINGLE_WORKFLOW,
					this.UPDATE_WORKFLOW_ONBOARDING_WORKFLOW_GROUP,
					this.INITIATE_TRANSACTIONS_DISPUTES,
					this.TRANSACTIONS_DISPUTES_CATEGORY_DROPDOWN,
					this.TRANSACTIONS_DISPUTES_LIST,
					this.TRANSACTIONS_DISPUTES_TOTAL_COUNT,
					this.TRANSACTIONS_DISPUTES_DONUT_CHART_SUMMARY,
					this.VIEW_TRANSACTIONS_DISPUTE,
					this.RESOLVE_TRANSACTIONS_DISPUTES,
					this.TRANSACTIONS_DISPUTES_FILE_UPLOADABLE_URL,
					this.TRANSACTIONS_DISPUTES_PROOFS,
					this.TEST,
					this.MERCHANT_ONBOARDING_APPLICATIONS,
					this.MERCHANT_ONBOARDING_SUMMARY,
					this.AUDIT_LOGS_LIST,
					this.AUDIT_LOGS_LIST_COUNT,
          this.NETWORK_PROCESSOR_LIST,
          this.SYSTEM_CONFIGURATION_LIST
          
				];
    }

    public static getByEndpoint(endpoint : string){
        let results = this.getValues().filter(item => item.endpoint === endpoint);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
      }

    public static getPermissionsByEndpointAndMethod(endpoint : string, method: string){
      for (const item of this.getValues()) {
        if (this.checkEndpoint(item.endpoint, endpoint) && item.method === method) {
          return item.permissions;
        }
      }
      return null;
    }

    private static checkEndpoint(patternUrl: string, originalUrl: string){
      const pattern = patternUrl.replace(/:\w+/g, '[^/]+');
      const regex = new RegExp(`^${pattern}$`);
      
      if (regex.test(originalUrl)) {
        return true;
      } else {
        return false
      }
    }

}

