import { StringUtils } from "@app/shared/utils/string-utils";
import { SelectQueryBuilder } from "typeorm";
import { Filter } from "./filter";
import { FilterCondition } from "@app/shared/constants/filter-condition.constant";

export class DynamicQueryBuilder<T> extends SelectQueryBuilder<T> {
	private queryBuilder: SelectQueryBuilder<T>;

	constructor (queryBuilder: SelectQueryBuilder<T>) {
		super(queryBuilder);
		this.queryBuilder = queryBuilder;
	}

	applyFilters(filters: Filter[]): SelectQueryBuilder<T> {
		filters?.forEach((filter) => {
			const { values } = filter;
			let condition = filter.condition;
			const field = StringUtils.camelToSnake(filter.field);
			if (!condition) {
				condition = "EQUALS";
			}
			switch (condition) {
				case "EQUALS":
					this.queryBuilder.andWhere(`${ field } = :${ field }`, {
						[field]: values[0],
					});
					break;
				case "LIKE":
					this.queryBuilder.andWhere(`${ field } ILIKE :${ field }`, {
						[field]: `%${ values[0] }%`,
					});
					break;
				case "ILIKE":
					this.queryBuilder.andWhere(`${ field } ILIKE :${ field }`, {
						[field]: `%${ values[0] }%`,
					});
					break;
				case FilterCondition.CONTAINS.name:
					this.queryBuilder.andWhere(`${ field } ILIKE :${ field }`, {
						[field]: `%${ values[0] }%`,
					});
					break;
				case "IN":
					this.queryBuilder.andWhere(`${ field } IN (:...${ field })`, {
						[field]: values,
					});
					break;
				case "BETWEEN":
					if (values.length === 2) {
						const timeStamp = ["00:00:00", "23:59:59"];
						this.queryBuilder.andWhere(`${ field } BETWEEN :start AND :end`, {
							start: values[0].toString().includes('00:00:00') ? values[0] : `${ values[0] } ${ timeStamp[0] }`,
							end: values[1].toString().includes('23:59:59') ? values[1] : `${ values[1] } ${ timeStamp[1] }`,
						});
					} else {
						throw new Error("BETWEEN condition requires exactly two values.");
					}
					break;
				case "NOT_EQUALS":
					this.queryBuilder.andWhere(`${ field } <> :${ field }`, {
						[field]: values[0],
					});
					break;
				case "NOT_LIKE":
					this.queryBuilder.andWhere(`${ field } NOT ILIKE :${ field }`, {
						[field]: `%${ values[0] }%`,
					});
					break;
				case "NOT_IN":
					this.queryBuilder.andWhere(`${ field } NOT IN (:...${ field })`, {
						[field]: values,
					});
					break;
				case "IS_NULL":
					this.queryBuilder.andWhere(`${ field } IS NULL`);
					break;
				case "IS_NOT_NULL":
					this.queryBuilder.andWhere(`${ field } IS NOT NULL`);
					break;

				default:
					this.queryBuilder.andWhere(`${ field } = :${ field }`, {
						[field]: values[0],
					});
					break;
			}
		});

		return this.queryBuilder;
	}
}
