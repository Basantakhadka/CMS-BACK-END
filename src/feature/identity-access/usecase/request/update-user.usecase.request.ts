import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class UpdateUserUsecaseRequest implements UsecaseRequest {
    constructor (
        public id: string,
        public userName: string,
        public userId: string,
        public employeeId: string,
        public roles: Array<string>,
        public active: boolean
    ) { }
}