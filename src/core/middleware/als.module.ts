import { Global, Module } from "@nestjs/common";
import { AsyncLocalStorage } from "async_hooks";
import { RequestContextProvider } from "./RequestContextProvider";

@Global()
@Module({
	providers: [
		{
			provide: AsyncLocalStorage,
			useValue: new AsyncLocalStorage(),
		},
		RequestContextProvider,
	],
	exports: [AsyncLocalStorage, RequestContextProvider],
})
export class AlsModule {}
