import { Module } from "@nestjs/common";
import { ClientController } from "./client.controller";
import { GetClientListUsecase } from "./usecase/get-client-list.usecase";
import { ClientDbRepository } from "./repositories/db/client.repository";
import { PermissionsCheckerService } from "../auth/services/permissions-checker.service";

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [
    GetClientListUsecase,
    ClientDbRepository,
  ],
  exports: [],
})
export class ClientModule { }
