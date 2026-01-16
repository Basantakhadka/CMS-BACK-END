import { TaskType } from "./change-request-detail-task-type.constant";
import { EnumType } from "./enum-type.constant";

export class ChangeRequestStatus extends EnumType<ChangeRequestStatus> {
	public static readonly PENDING = new ChangeRequestStatus(
		"PENDING",
		"Pending",
	);
	public static readonly APPROVED = new ChangeRequestStatus(
		"APPROVED",
		"Approved"
	);
	public static readonly IN_APPROVAL = new ChangeRequestStatus(
		"IN_APPROVAL",
		"In-Approval",
		2
	);
	public static readonly REJECTED = new ChangeRequestStatus(
		"REJECTED",
		"Rejected",
		4
	);
	public static readonly IN_REVIEW = new ChangeRequestStatus(
		"IN_REVIEW",
		"In Review",
		1
	);
	public static readonly IN_EDIT = new ChangeRequestStatus(
		"IN_EDIT",
		"In Edit"
	);
	public static readonly REQUEST_FOR_CHANGE = new ChangeRequestStatus(
		"REQUEST_FOR_CHANGE",
		"Request for Change",
		3
	);
	public static readonly IN_FEE_SETUP = new ChangeRequestStatus(
		"IN_FEE_SETUP",
		"In Fee Configuration"
	);
	public static readonly CANCELED = new ChangeRequestStatus(
		"CANCELED",
		"Canceled"
	);
	public static readonly DRAFT = new ChangeRequestStatus(
		"DRAFT",
		"Draft"
	);

	constructor(
		public readonly name: string,
		public readonly displayname: string,
		public readonly sortOrder: number = -1
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): ChangeRequestStatus[] {
		return [
			this.IN_APPROVAL,
			this.PENDING,
			this.REJECTED,
			this.APPROVED,
			this.IN_REVIEW,
			this.REQUEST_FOR_CHANGE,
			this.IN_FEE_SETUP,
			this.CANCELED,
			this.IN_EDIT,
			this.DRAFT
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}

	public static getByTaskType(taskType: string): ChangeRequestStatus {
		switch (taskType) {
			case TaskType.EDIT.name:
			case TaskType.MAKER.name:
				return ChangeRequestStatus.IN_EDIT;
			case TaskType.REVIEW.name:
				return ChangeRequestStatus.IN_REVIEW;
			case TaskType.VERIFY.name:
				return ChangeRequestStatus.IN_APPROVAL;
			default:
				ChangeRequestStatus.PENDING;
		}
	}
}
