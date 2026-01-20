import { publicRoutes } from '@app/feature/common/publicRoutes';
import { InstitutionCodePrefixType } from '@app/shared/constants/institution-code-prefix.constant';
import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response } from 'express';
import { NextFunction } from 'express-serve-static-core';
import { JwtStrategy } from '../auth/JwtStrategy';
import { AuthTokenStrategy } from '../auth/authtoken.strategy';
import { TokenIntegrityValidator } from '../auth/tokenIntegrityValidator';
import { UserPoolService } from '../cache/user-pool.service';
import { RequestContextProvider } from './RequestContextProvider';
import { CurrentUser } from './current_user';
import { RequestContext } from './request_context';
import { sseRoutes } from '@app/feature/common/publicRoutes';
import { CacheFactory } from '../cache/cache.factory';
import { decrypt } from '../auth/encryption';
import { decodeBase64 } from '@app/shared/utils/base64-utils';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    private excludedRoutes: string[] = [];

    constructor(
        private requestContextProvider: RequestContextProvider,
        private jwtStrategy: JwtStrategy,
        private tokenIntegrityValidator: TokenIntegrityValidator,
        private userPoolService: UserPoolService,
        private readonly als: AsyncLocalStorage<RequestContext>,
        private cacheFactory: CacheFactory
    ) {}

    configurePublicRoutes(excludedRoutes: string[]): void {
        this.excludedRoutes = excludedRoutes;
    }

    async use(req: Request, res: Response, next: NextFunction) {
        const isExcludedRoute = publicRoutes.some((route) => req.originalUrl.includes(route));
        const institutionType = (req.headers['institution-type'] as string) || 'ACQUIRER';
        const institutionCode = (req.headers['institutioncode'] || req.headers['institutionCode'] || req.headers['institution-code']) as string;

        const isRoutesSSE = sseRoutes.some((route) => req.originalUrl.includes(route));

        if (isRoutesSSE) {
            const jti = req?.query?.token || req?.query?.accessToken;
            const base64DecodedJti = decodeBase64(jti as string);

            let finalJti = decrypt(base64DecodedJti as string);


            const accesstoken = (await this.cacheFactory.getCachedData(finalJti as string)) as string;
            const isEncoded = req?.query?.enc;
            let token: string;
            if (isEncoded) {
                token = Buffer.from(accesstoken as string, 'base64').toString('utf-8') as string;
            } else {
                token = accesstoken as string;
            }
            const requestContext = await AuthTokenStrategy.parseToken(token, this.jwtStrategy, this.tokenIntegrityValidator, this.userPoolService);

            const newToken = await AuthTokenStrategy.updateToken(token, this.userPoolService, this.cacheFactory,req?.originalUrl);

            res.setHeader('X-XSRF-TOKEN', newToken);

            this.als.enterWith(requestContext);
            return next();
        }

        if (isExcludedRoute) {
            const schema = InstitutionCodePrefixType.getSchema(institutionCode)?.toLowerCase();
            const jti = '';
            const currentUser = new CurrentUser('', '', '', institutionCode?.toLowerCase(), schema, '', []);
            const requestContext = new RequestContext(currentUser, jti);
            this.als.enterWith(requestContext);
            return next();
        }

        const token = req.headers['x-xsrf-token'] as string;

        const requestContext = await AuthTokenStrategy.parseToken(token, this.jwtStrategy, this.tokenIntegrityValidator, this.userPoolService);

        requestContext.getCurrentUser().requestedInstitutionType = institutionType;

        if (!requestContext.getCurrentUser().institutionType.includes(institutionType)) {
            throw new ForbiddenException(
                `Access Denied: Your current institution type does not allow access to this feature. Please make sure you are affiliated with a valid ${institutionType} institution.`
            );
        }

        this.requestContextProvider.set(requestContext);
        const store = {
            requestContext
        };
        this.als.enterWith(store.requestContext);

        return next();
    }
}
