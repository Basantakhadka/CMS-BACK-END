import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    UseGuards,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { ContractsService } from './contracts.service';
import { CreateContractDto } from './dtos/create-contract.dto';
import { UpdateContractDto } from './dtos/update-contract.dto';

@ApiTags('Contracts')
@ApiBearerAuth()
@Controller('contracts')
export class ContractsController {
    constructor (private readonly contractsService: ContractsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new contract' })
    create(@Body() createContractDto: CreateContractDto) {
        return this.contractsService.create(createContractDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all contracts' })
    findAll(@Query('page') page?: number, @Query('limit') limit?: number) {
        return this.contractsService.findAll(page, limit);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a contract by ID' })
    findOne(@Param('id') id: string) {
        return this.contractsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a contract' })
    update(@Param('id') id: string, @Body() updateContractDto: UpdateContractDto) {
        return this.contractsService.update(id, updateContractDto);
    }

    @Delete(':id')
    @ApiOperation({ summary: 'Delete a contract' })
    remove(@Param('id') id: string) {
        return this.contractsService.remove(id);
    }
}
