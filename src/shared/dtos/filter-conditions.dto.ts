import { Filter } from "@app/core/repository/search/filter";
import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { PageInfo } from "@app/core/repository/search/page.info";
import { SortMeta } from "@app/core/repository/search/sort.meta";

export class FiltersObjectsDto {
  @ApiProperty({ default: "requestedFor" })
  field: string;
  @ApiProperty({ default: "IN" })
  condition: string;
  @ApiProperty({ default: ["ADD", "DELETE"] })
  values: string[] | number[];
}

export class StateDto {
  @ApiProperty({
    default: [],
  })
  next: string[] = [];

  @ApiProperty({
    default: [],
  })
  @ApiProperty()
  previous: string[] = [];
}

export class PageInfoDto {
  @ApiProperty({
    default: 0,
  })
  current: number;
  @ApiProperty({
    default: 10,
  })
  size: number;

  @ApiProperty({
    default: 1,
  })
  target: number;


  @ApiProperty({
    default: [],
  })
  sortInfo: [SortMeta];
}

export class FilterConditionsDto {
  filters: Filter[];
  pageInfo?: PageInfo;
}

export class FilterOnlyDto {
  filters: Filter[];
}


export class FiltersDto {
  filters: [FilterConditionsDto];
}

export class SortInfoDto {
  @ApiPropertyOptional()
  field: string;
  @ApiPropertyOptional()
  order: string;
}

export class filtersDto {
  filters: [FilterConditionsDto];
}

export class DynamicFiltersDto {
  filters: Filter[];
  pageInfo?: PageInfo;
  searchText?: string;
  isReport?: boolean;
}
