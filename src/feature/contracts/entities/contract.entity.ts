import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum ContractStatus {
    DRAFT = 'DRAFT',
    PENDING_APPROVAL = 'PENDING_APPROVAL',
    APPROVED = 'APPROVED',
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    TERMINATED = 'TERMINATED',
    REJECTED = 'REJECTED',
}

export enum ContractType {
    SERVICE = 'SERVICE',
    VENDOR = 'VENDOR',
    EMPLOYMENT = 'EMPLOYMENT',
    NDA = 'NDA',
    PARTNERSHIP = 'PARTNERSHIP',
    OTHER = 'OTHER',
}

@Entity('contracts')
export class Contract {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255 })
    title: string;

    @Column({ type: 'text', nullable: true })
    description: string;

    @Column({ type: 'varchar', length: 100, unique: true })
    contractNumber: string;

    @Column({
        type: 'enum',
        enum: ContractType,
        default: ContractType.SERVICE,
    })
    contractType: ContractType;

    @Column({
        type: 'enum',
        enum: ContractStatus,
        default: ContractStatus.DRAFT,
    })
    status: ContractStatus;

    @Column({ type: 'varchar', length: 255 })
    partyA: string;

    @Column({ type: 'varchar', length: 255 })
    partyB: string;

    @Column({ type: 'date' })
    startDate: Date;

    @Column({ type: 'date' })
    endDate: Date;

    @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
    value: number;

    @Column({ type: 'varchar', length: 10, nullable: true })
    currency: string;

    @Column({ type: 'text', nullable: true })
    terms: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, any>;

    @Column({ type: 'uuid', nullable: true })
    createdBy: string;

    @Column({ type: 'uuid', nullable: true })
    updatedBy: string;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @Column({ type: 'timestamp', nullable: true })
    deletedAt: Date;
}
