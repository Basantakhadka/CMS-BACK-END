// entities/contract.entity.ts
import { DbEntity } from '@app/core/repository/entity';
import { PrimaryTextColumn } from '@app/shared/entities/entities.decorator';
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('cms_contracts')
export class Contract  {
  @PrimaryTextColumn()
  id: string;

  @Column()
  contract_title: string;

  @Column()
  contract_type: string;

  @Column({ type: 'jsonb' })
parties: any[]; 

  @Column({ type: 'date' })
  expiry_date: string;

  @Column()
  document_link: string;

  @Column({ type: 'numeric', precision: 15, scale: 2, nullable: true })
  contract_value?: number;

  @Column({ nullable: true })
  jurisdiction?: string;

  @Column({ nullable: true })
  renewal_terms?: string;

  @Column({ nullable: true })
  governing_law?: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
  
  @Column({ type: 'boolean', default: false })
deleted: boolean;

  static getTableName() {
    return "cms_contracts";
  }

  getColumns?(): Map<string, string> {
    const map = new Map<string, string>();
    map.set("id", "id");
    map.set("contract_title", "title");
    map.set("contract_type", "type");
    map.set("parties", "parties");
    map.set("expiry_date", "expiryDate");
    map.set("document_link", "documentLink");
    map.set("contract_value", "contractValue");
    map.set("jurisdiction", "jurisdiction");
    map.set("renewal_terms", "renewalTerms");
    map.set("created_at", "createdAt");
    map.set("updated_at", "updatedAt");
    map.set("governing_law", "governingLaw");
    return map;
  }
  

  getClusterColumns?(): string[] {
    // If you have clustered columns for sharding / partitioning, list them here
    return [];
  }
}
