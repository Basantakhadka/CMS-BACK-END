import { UsecaseRequest } from "CMS-BACK-END/src/core/usecase/usecase.request";

export class DeleteUserUsecaseRequest implements UsecaseRequest{
    constructor(
        public id: string
    ){}
}