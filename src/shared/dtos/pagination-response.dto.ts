import { PageInfo } from "CMS-BACK-END/src/core/repository/search/page.info";

export class PaginationResponseDto<T> {
    list: T[];
    pageInfo: PageInfo;
}