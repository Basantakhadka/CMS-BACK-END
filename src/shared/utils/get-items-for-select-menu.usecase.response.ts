import { BaseRepository } from "@app/core/repository/base.repository";
import { UsecaseResponse } from "@app/core/usecase/usecase.response";

export class SelectMenu {
    label: string;
    value: string;
    constructor (label: string, value: string) {
        this.label = label,
            this.value = value
    }
}

export class GetItemsForSelectMenuUsecaseResponse implements UsecaseResponse {
    constructor (
        public readonly data: SelectMenu[]
    ) { }
}