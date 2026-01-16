import { Filter } from "CMS-BACK-END/src/core/repository/search/filter";
import { PageInfo } from "CMS-BACK-END/src/core/repository/search/page.info";
import { SortMeta } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { IssuersTransactionsEntity } from "@app/feature/transactions/entities/issuers-transactions.entity";
import { Transactions } from "@app/feature/transactions/entities/transactions.entity";
import { PageInfoDto } from "./page-info-response.dto";


export class PaginationResponseInfos {
    filters: Filter[];
    pageInfo: PageInfo;
    searchText: string;
}

export class TransactionListResponseDto{
    list: Transactions[] | IssuersTransactionsEntity[];
    paginationInfo: PaginationResponseInfos
    totalTransactionAmount: number;
}

export class TransactionsResponseDto {
   list=[];
   pageInfo:PageInfoDto;
   sortInfo:SortMeta[];
   totalTransactionAmount:number;
}

export class StateInfoDto{
    next:string[];
    previous:string[];
}
export class TransactionsColumnsDto{
    txnId: string
    txnYear: number
    txnYearMonth: number
    txnDate: Date
    txnDateTime: string
    txnAmount: number
    txnCurrency: number
    merchantName: string
    outletType: string
    outletName: string
    txnType: string
    paymentStatus: string
}