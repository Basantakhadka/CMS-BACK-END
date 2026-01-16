import { Result } from "@app/feature/common/result";
import { GetRiskAlertNotificationDetailsResponse } from "@app/feature/risk-management/usecases/response/get-risk-alert-notification-details.response";

export const GetRiskAlertNotificationDetailsResponseStub = () => {
  const listItems = [
    {
      id: "92ea2273-88c4-4663-b735-da58ad656fea",
      emailFor: "Email Alert Notification",
      email: ["amankhadka101@gmail.com"],
    },
    {
      id: "7dff7bb2-cd81-4f01-ad0b-f693507729bc",
      emailFor: "Email Block Notification",
      email: ["amankhadka101@gmail.com"],
    },
  ];
  const response = {
    code: "0",
    message: "SUCCESS",
    data: new GetRiskAlertNotificationDetailsResponse(listItems),
    errors: [],
  };
  return new Result(
    response.code,
    response.message,
    response.data.list,
    response.errors
  );
};
