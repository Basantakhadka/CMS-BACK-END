import { CONTRACT_CHANGE_REQUEST_TABLE } from "../constants/change-request.constants";
import { Column, CreateDateColumn, Entity, PrimaryColumn, UpdateDateColumn } from "typeorm";

@Entity(CONTRACT_CHANGE_REQUEST_TABLE)
export class ContractChangeRequest {
    @PrimaryColumn("text")
    id: string;

    @Column({ type: "text", nullable: true })
    contract_id?: string;

    @Column({ type: "text" })
    change_type: string;

    @Column({ type: "text", default: "PENDING" })
    status: string;

    @Column({ type: "text" })
    requested_by: string;

    @CreateDateColumn({ type: "timestamp", default: () => "NOW()" })
    requested_at: Date;

    @Column({ type: "text", nullable: true })
    approved_by?: string;

    @Column({ type: "timestamp", nullable: true })
    approved_at?: Date;

    @Column({ type: "text", nullable: true })
    remarks?: string;

    @Column({ type: "jsonb", nullable: true })
    old_data?: Record<string, any>;

    @Column({ type: "jsonb", nullable: true })
    new_data?: Record<string, any>;

    @Column({ type: "text", default: "000" })
    client_code: string;

    static getTableName() {
        return CONTRACT_CHANGE_REQUEST_TABLE;
    }
}
