import { GetMccCategoryListRequest } from "@app/feature/risk-management/usecases/request/get-mcc-category-list.request";

export const getMccListRequestStub = () => {
  const request = new GetMccCategoryListRequest();

  return request; 
}
