import { BaseRepository } from "@app/core/repository/base.repository";
import { GeneralPolicy } from "../entities/general-policy.entity";

export interface GeneralPolicyRepository extends BaseRepository<GeneralPolicy, string> { }