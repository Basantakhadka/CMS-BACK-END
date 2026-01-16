import { FilterCondition } from "CMS-BACK-END/src/shared/constants/filter-condition.constant";
import { Filter } from "./filter";
import { PageInfo } from "./page.info";
import { SortMeta, SortOrder } from "./sort.meta";
import { StringUtils } from "CMS-BACK-END/src/shared/utils/string-utils";
import { PageImpl } from "./pageImpl";

export class NativeQueryHelper {
    static prepareNativeQuery(
        query: string,
        columnsMap: Map<string, string>,
        defaultSortMeta: SortMeta,
        filters: Filter[],
        pageInfo: PageInfo
    ): string {
        //SET CRITERIA AND ORDER FOR PAGINATION
        let encodedNextState: string;
        let decodedNextState: string;
        if (pageInfo) {
            encodedNextState = pageInfo?.state?.next[0]
            decodedNextState = encodedNextState
                ? Buffer.from(encodedNextState, "hex").toString("utf-8")
                : "";
        }

        let clusterFilters = "";
        let clusterOrders = "";
        const defaultSortCols = defaultSortMeta.field
            .split(",")
            .map(
                (item) =>
                    `${ columnsMap != null && columnsMap.get(item)
                        ? columnsMap.get(item)
                        : StringUtils.camelToSnake(item)
                    }`
            )
            .join(" , ");

        if (decodedNextState) {
            const offsetValues = decodedNextState;
            if (defaultSortMeta.order == SortOrder.DESC) {
                clusterFilters = ` AND (${ defaultSortCols }) < (${ offsetValues })`;
            } else {
                clusterFilters = ` AND (${ defaultSortCols }) > (${ offsetValues })`;
            }
        }
        clusterOrders = `(${ defaultSortCols }) ${ defaultSortMeta.order }`;

        //SET PAGE LIMIT]
        let filterExpression = filters
            ? FilterCondition.buildFilterExpressionAndPrepend(filters)
            : "";

        if (pageInfo) {
            query =
                query +
                clusterFilters +
                filterExpression +
                " ORDER BY " +
                clusterOrders +
                " LIMIT " +
                pageInfo.size;
        } else {
            query = query + clusterFilters + filterExpression;
        }
        return query;
    }

    /**
     * Prepares the PageInfo object based on the provided parameters.
     * If requestPageInfo is not provided, a default PageInfo object is created.
     * If lastRow is provided, the next page state is generated based on the defaultSortMeta field.
     * @param defaultSortMeta The default sorting metadata used during fetching list result.
     * @param lastRow The last row of the list result.
     * @param requestPageInfo The requested PageInfo object by client.
     * @returns The prepared PageInfo object.
     */
    static preparePageInfo(
        defaultSortMeta: SortMeta,
        lastRow: any,
        requestPageInfo: PageInfo
    ): PageInfo {
        if (!requestPageInfo) {
            requestPageInfo = new PageInfo(0, 1, 10, { next: [], previous: [] }, []);
        }

        const currentPage = requestPageInfo.current + 1;
        const targetPage = requestPageInfo.target + 1;
        const pageSize = requestPageInfo.size;
        let pageStateNext;
        const pginfo = new PageInfo(
            currentPage,
            targetPage,
            pageSize,
            { next: [], previous: [] },
            []
        );

        if (lastRow) {
            pageStateNext = defaultSortMeta.field
            .split(",")
            .map((item) => `'${ StringUtils.convertToString(lastRow[item]) }'`)
            .join(" , ");
            pageStateNext = Buffer.from(pageStateNext, "utf-8").toString("hex");
            pginfo.state.next.push(pageStateNext);
        }

        return pginfo;
    }

    /**
     * Prepares the page information for native pagination.
     * 
     * @template T - The type of the data in the list.
     * @param defaultSortMeta - The default sorting metadata used during fetching list result.
     * @param listData - The list data.
     * @param requestPageInfo - The requested page information.
     * @returns The prepared PageImpl object.
     */
    static preparePageInfoForNativePagination<T>(
        defaultSortMeta: SortMeta,
        listData: any,
        requestPageInfo: PageInfo,
    ): PageImpl<T> {
        const totalList = listData?.length | 0;
        let pageInfoDto: PageInfo = this.preparePageInfo(
            defaultSortMeta,
            listData[totalList - 1],
            requestPageInfo
        );

        if (listData.length < requestPageInfo.size) {
            pageInfoDto.state.next = [];
        }

        let page = new PageImpl<T>(
            null,
            pageInfoDto?.current,
            pageInfoDto?.target,
            pageInfoDto.size,
            pageInfoDto.state,
            null,
            listData,
            null
        );
        return page;
    }
}
