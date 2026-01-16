
export class DoughNutChartResponseDto {
    remarks?: string;
    total: number;
    results: ChartResults[];

}
export class ChartResults {
    key: string;
    label: string;
    value: number;
    valueInPercentage: number;
    colorPalette: string[];
}
export class FieldAndValueDtos {
    field: string;
    value: number
}

export class DoughnutDbResultDto{
    constructor(
        public status: string,
        public count: number
    ){}
}