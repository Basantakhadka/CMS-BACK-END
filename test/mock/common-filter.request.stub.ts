import { SortMeta, SortOrder } from "@app/core/repository/search/sort.meta"

export const commonFilterRequestStub = ()=>{
    return {
        filters: [],
        pageInfo: {
            current: 0,
            size: 5,
            target: 1,
            state: {
                next: [],
                previous: []
            },
            sortInfo:[new SortMeta("", SortOrder.DESC)]
        }
    }
}