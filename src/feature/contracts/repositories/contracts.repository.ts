import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from '../entities/contract.entity';

@Injectable()
export class ContractsRepository {
    constructor (
        @InjectRepository(Contract)
        private readonly repository: Repository<Contract>,
    ) { }

    async findByContractNumber(contractNumber: string): Promise<Contract | null> {
        return await this.repository.findOne({ where: { contractNumber } });
    }

    async findActiveContracts(): Promise<Contract[]> {
        return await this.repository
            .createQueryBuilder('contract')
            .where('contract.status = :status', { status: 'ACTIVE' })
            .andWhere('contract.endDate >= :today', { today: new Date() })
            .getMany();
    }

    async findExpiringContracts(daysThreshold: number = 30): Promise<Contract[]> {
        const thresholdDate = new Date();
        thresholdDate.setDate(thresholdDate.getDate() + daysThreshold);

        return await this.repository
            .createQueryBuilder('contract')
            .where('contract.status = :status', { status: 'ACTIVE' })
            .andWhere('contract.endDate <= :threshold', { threshold: thresholdDate })
            .andWhere('contract.endDate >= :today', { today: new Date() })
            .getMany();
    }
}
