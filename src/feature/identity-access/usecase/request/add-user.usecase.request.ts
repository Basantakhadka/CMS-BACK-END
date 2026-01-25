import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class AddUserUsecaseRequest implements UsecaseRequest {
    constructor (
        public userName: string,
        public userId: string,
        public employeeId: string,
        public roles: Array<string>,
        public active: boolean
    ) { }
}