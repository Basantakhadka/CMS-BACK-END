export class ReportAggregatorDto {  
  partition: number;
  memberCode: string;
  data: ReportAggregatorDataDto[]
}

export class ReportAggregatorDataDto{ 
  report_key: string;
  category: string
  date: Date;   
  category_description: string;
  description: string;
  value: number;
  relations: string[];
  unit: string;
  frequency: string; 
  gmid: string; 
}