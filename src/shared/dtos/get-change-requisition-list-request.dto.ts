import { PageInfo } from "CMS-BACK-END/src/core/repository/search/page.info";
import { SearchMeta } from "CMS-BACK-END/src/core/repository/search/search.meta";

export class GetChangeRequisitionListRequestDto{

    // @IsArray()
    filter: SearchMeta;

    // @IsObject()
    pageInfo: PageInfo
}