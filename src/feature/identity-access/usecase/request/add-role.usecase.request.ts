import { UsecaseRequest } from "@app/core/usecase/usecase.request";

export class AddRoleUsecaseRequest implements UsecaseRequest {
    constructor (
        public title: string,
        public active: boolean,
        public permission: Array<string>,
        public contractIds?: Array<string>
    ) { }
}