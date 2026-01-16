import { SortMeta } from "CMS-BACK-END/src/core/repository/search/sort.meta";
import { IsNotEmpty, IsOptional } from "class-validator";


export class PaymentAcceptingPointsResponseDto
    {
   list=[];
   pageInfo:PageInfoDto;
   sortInfo:SortMeta[];
   totalTransactionAmount:number;

    }
    export class PageInfoDto{
        current:number;
        target:number;
        size:number;
        state:StateInfoDto;
    }
    export class StateInfoDto{
        next:string[];
        previous:string[];
    }
    export class PaymentAcceptingPointsColumnsDto{
        outletId :string;
        applicationId :string;
        alias :string;
        fees :string;
        mccType :string;
        mid :string;
        papId: string;
        paymentAcceptingPoint :string;
        tag :string;
        tid :string;
        url:string
        risk:string;
        createdDate:string;
        

    }