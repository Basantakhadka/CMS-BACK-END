import { v1 as uuidv1 } from "uuid";
import { v4 as uuidv4 } from "uuid";

export class IdGenerator {
	static generateId(version?: string) {
		if (!version || version === "1") {
			return uuidv1();
		}
		return uuidv4();
	}
}

export enum IdType {
	UUIDV1,
	UUIDV4,
}
