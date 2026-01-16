import { EnumType } from "./enum-type.constant";

export class WorkflowGroupType extends EnumType<WorkflowGroupType> {
	public static readonly ONB = new WorkflowGroupType(
		"ONB",
		"Merchant Onboarding"
	);
	public static readonly MIM = new WorkflowGroupType(
		"MIM",
		"Merchant Information Modification"
	);
	public static readonly ICW = new WorkflowGroupType(
		"ICW",
		"IAM Creation Workflow"
	);
	public static readonly IMW = new WorkflowGroupType(
		"IMW",
		"IAM Modification Workflow"
	);
	public static readonly MSC = new WorkflowGroupType(
		"MSC",
		"Merchant Service Fee Creation"
	);
	public static readonly MSM = new WorkflowGroupType(
		"MSM",
		"Merchant Service Fee Modification"
	);
	public static readonly RMC = new WorkflowGroupType(
		"RMC",
		"Risk Management Creation"
	);
	public static readonly RMM = new WorkflowGroupType(
		"RMM",
		"Risk Modification"
	);
	public static readonly OC = new WorkflowGroupType("OC", "Outlet Creation");
	public static readonly OIM = new WorkflowGroupType(
		"OIM",
		"Outlet Information Modification"
	);
	public static readonly NPO = new WorkflowGroupType(
		"NPO",
		"Network Processor Onboarding"
	);
	public static readonly NPM = new WorkflowGroupType(
		"NPM",
		"Network Processor Modification"
	);
	public static readonly IDC = new WorkflowGroupType(
		"IDC", 
		"ID Configuration Creation"
	)

	constructor(
		public readonly name: string,
		public readonly displayname: string
	) {
		super(name);
		this.displayname = displayname;
	}

	public static getValues(): WorkflowGroupType[] {
		return [
			this.ONB,
			this.MIM,
			this.ICW,
			this.RMC,
			this.RMM,
			this.OC,
			this.OIM,
			this.NPO,
			this.NPM,
			this.IDC,
		];
	}
	public static getByName(name: string) {
		let results = this.getValues().filter((item) => item.name === name);
		if (results && results.length > 0) {
			return results[0];
		}
		return null;
	}
}

export class WorkflowType extends EnumType<WorkflowType>{
    public static readonly SELF = new WorkflowType('SELF', 'Self');
    public static readonly BACKOFFICE = new WorkflowType('BACKOFFICE','Back Office');

    constructor(public readonly name:string, public readonly displayName:string){
        super(name);
        this.displayName = displayName
    }
    public static getValues():WorkflowType[]{
        return[
            this.SELF, this.BACKOFFICE
        ]
    }
    public static getByName(name : string){
        let results = this.getValues().filter(item => item.name === name);
        if(results && results.length > 0){
          return results[0];
        }
        return null;
    }
}