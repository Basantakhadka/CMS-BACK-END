import { BaseRepository } from "CMS-BACK-END/src/core/repository/base.repository";
import { BankBranch } from "../entities/bank-branch.entity";

export interface BankBranchesRepository extends BaseRepository<BankBranch, string>{}