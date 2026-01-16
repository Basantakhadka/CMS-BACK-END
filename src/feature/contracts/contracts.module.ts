import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContractsController } from './contracts.controller';
import { ContractsService } from './contracts.service';
import { Contract } from './entities/contract.entity';
import { ContractsRepository } from './repositories/contracts.repository';

@Module({
    imports: [TypeOrmModule.forFeature([Contract])],
    controllers: [ContractsController],
    providers: [ContractsService, ContractsRepository],
    exports: [ContractsService],
})
export class ContractsModule { }
