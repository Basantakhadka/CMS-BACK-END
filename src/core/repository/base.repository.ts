import { DbEntity } from "./entity";
import { Page } from "./search/page";
import { PageableInfo } from "./search/pageable.info";
import { SearchMeta } from "./search/search.meta";

export interface BaseRepository<E extends DbEntity, ID> {
	insert(entity: E): Promise<E>;

	update(entity: E): Promise<E>;

	delete(entity: E): Promise<void>;

	findById(id: ID): Promise<E>;

	findAllWithFilters(
		filters: SearchMeta,
	): Promise<E[]>;

	findTotalCountWithFilters(
		filters: SearchMeta,
	): Promise<number>;

	findAllWithPagination(
		filters: SearchMeta,
		pageableInfo: PageableInfo,
	): Promise<Page<E>>;

	findAll(): Promise<E[]>;

	findTotalCount(): Promise<number>;
}
