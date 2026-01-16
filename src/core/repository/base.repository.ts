import { DbEntity } from "./entity";
import { Page } from "./search/page";
import { PageableInfo } from "./search/pageable.info";
import { SearchMeta } from "./search/search.meta";

export interface BaseRepository<E extends DbEntity, ID> {
	insert(entity: E, institutionCode?: string): Promise<E>;

	update(entity: Partial<E>, institutionCode?: string): Promise<E>;

	delete(entity: E, institutionCode?: string): Promise<void>;

	findById(id: ID, institutionCode?: string): Promise<E>;

	findAllWithFilters(
		filters: SearchMeta,
		institutionCode?: string
	): Promise<E[]>;

	findTotalCountWithFilters(
		filters: SearchMeta,
		institutionCode?: string
	): Promise<number>;

	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo,
		institutionCode?: string
	): Promise<Page<E>>;

	findAll(institutionCode?: string): Promise<E[]>;

	findTotalCount(institutionCode?: string): Promise<number>;
}
