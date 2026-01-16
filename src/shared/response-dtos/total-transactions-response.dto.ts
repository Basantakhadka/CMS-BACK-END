import { CurrencyWiseSumOfAmountOfTransaction } from "@app/feature/transactions/entities/currency.wise.total.amount.sum.of.transaction.view";

export class CurrencyWiseTotalTransactionDto{
    currency:string;
    total:number;
}
export class SumAmountResponseDto{
        total:CurrencyWiseTotalTransactionDto[];
}