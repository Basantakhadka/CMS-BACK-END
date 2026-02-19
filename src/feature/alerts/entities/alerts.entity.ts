// entities/contract-alert.entity.ts
import { Contract } from '@app/feature/contracts/entities/contracts.entity';
import { PrimaryTextColumn } from '@app/shared/entities/entities.decorator';
import { Entity, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity('cms_contract_alerts')
export class ContractAlert {
  @PrimaryTextColumn()
  id: string;

 // 🔗 Relation with contracts
  @Column({ type: 'text' })
  contract_id: string;




  @ManyToOne(() => Contract, contract => contract, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'contract_id' })
  contract: Contract;
  @Column({ select: false }) // Optional: computed column
contract_title?: string;

  @Column({ type: 'boolean', default: false })
  trigger_expiry: boolean;

  @Column({ type: 'boolean', default: false })
  enable_custom: boolean;

  @Column({ type: 'text', nullable: true })
  reminder_interval?: string;

  @Column({ type: 'json', nullable: true })
  communication_channels?: any;

 @Column({ type: 'jsonb', nullable: true })
stakeholders?: string[];


  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @Column({ type: 'boolean', default: false })
  deleted: boolean;

  static getTableName() {
    return 'cms_contract_alerts';
  }

  getColumns?(): Map<string, string> {
    const map = new Map<string, string>();
    map.set('id', 'id');
    map.set('contract_id', 'contractId'); // store relation as contractId in DTO
    map.set('contract_title', 'contract_title'); // store contract title as title in DTO
    map.set('trigger_expiry', 'triggerExpiry');
    map.set('enable_custom', 'enableCustom');
    map.set('reminder_interval', 'reminderInterval');
    map.set('communication_channels', 'communicationChannels');
    map.set('stakeholders', 'stakeholders');
    map.set('created_at', 'createdAt');
    map.set('updated_at', 'updatedAt');
    map.set('deleted', 'deleted');
    return map;
  }

  getClusterColumns?(): string[] {
    return [];
  }
}
