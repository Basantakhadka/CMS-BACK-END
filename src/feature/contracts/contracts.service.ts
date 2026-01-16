import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Contract } from './entities/contract.entity';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';

@Injectable()
export class ContractsService {
    constructor (
        @InjectRepository(Contract)
        private readonly contractRepository: Repository<Contract>,
    ) { }

    async create(createContractDto: CreateContractDto): Promise<Contract> {
        const contract = this.contractRepository.create(createContractDto);
        return await this.contractRepository.save(contract);
    }

    async findAll(page: number = 1, limit: number = 10): Promise<{ data: Contract[]; total: number }> {
        const [data, total] = await this.contractRepository.findAndCount({
            skip: (page - 1) * limit,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, total };
    }

    async findOne(id: string): Promise<Contract> {
        const contract = await this.contractRepository.findOne({ where: { id } });
        if (!contract) {
            throw new NotFoundException(`Contract with ID ${ id } not found`);
        }
        return contract;
    }

    async update(id: string, updateContractDto: UpdateContractDto): Promise<Contract> {
        const contract = await this.findOne(id);
        Object.assign(contract, updateContractDto);
        return await this.contractRepository.save(contract);
    }

    async remove(id: string): Promise<void> {
        const contract = await this.findOne(id);
        await this.contractRepository.remove(contract);
    }
}
