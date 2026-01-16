import { PageInfoDto } from "CMS-BACK-END/src/shared/dtos/filter-conditions.dto";
import { Repository } from "typeorm";
import {
    MapSnakeCaseToCamelCaseWithFieldMap
} from "../../../feature/common/mapper";
import { Filter } from "./filter";
import { NativeQueryHelper } from "./native-query-helper";
import { PageInfo } from "./page.info";
import { PageImpl } from "./pageImpl";
import { SortMeta } from "./sort.meta";

export interface NativePaginationOptions {
    columnsMap: Map<string, string> | null;
    defaultSortMeta: SortMeta;
    filters?: Filter[];
}
export class NativePagination<T> {
    constructor (private repository: Repository<T>, private pageInfo: PageInfo) { }

    public async nativePaginate(query: string, options: NativePaginationOptions) {
        const filters = options.filters?.length ? options.filters : null;
        if (!this.pageInfo) {
            this.pageInfo = new PageInfoDto();
            this.pageInfo.current = 1;
            this.pageInfo.target = 2;
            this.pageInfo.size = 10;
            this.pageInfo.sortInfo = [];
            this.pageInfo.state = { next: [], previous: [] };
        }

        query = NativeQueryHelper.prepareNativeQuery(
            query,
            options.columnsMap,
            options.defaultSortMeta,
            filters,
            this.pageInfo
        );

        const result = await this.repository.query(query);
        const list = MapSnakeCaseToCamelCaseWithFieldMap(
            result,
            options.columnsMap
        );
        let pageInfo: PageInfo = new PageInfoDto();
        if (list?.length) {
            pageInfo = NativeQueryHelper.preparePageInfo(
                options.defaultSortMeta,
                list[list.length - 1],
                this.pageInfo
            );
            if (list.length < pageInfo.size) {
                pageInfo.state.next = [];
            }
        } else {
            pageInfo.current = this.pageInfo.current;
            pageInfo.size = this.pageInfo.size;
            pageInfo.target = this.pageInfo.target;
            pageInfo.sortInfo = this.pageInfo.sortInfo || [];
            pageInfo.state = this.pageInfo.state;
        }
        let page = new PageImpl<T>(
            null,
            pageInfo?.current,
            pageInfo?.target,
            pageInfo.size,
            pageInfo.state,
            null,
            list,
            null
        );
        return page;
    }
}
