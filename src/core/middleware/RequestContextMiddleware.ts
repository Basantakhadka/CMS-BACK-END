import { publicRoutes, sseRoutes } from '@app/feature/common/publicRoutes';
import {
    ForbiddenException,
    Injectable,
    NestMiddleware,
} from '@nestjs/common';
import { AsyncLocalStorage } from 'async_hooks';
import { Request, Response, NextFunction } from 'express';

import { JwtStrategy } from '../auth/JwtStrategy';
import { AuthTokenStrategy } from '../auth/authtoken.strategy';
import { TokenIntegrityValidator } from '../auth/tokenIntegrityValidator';
import { UserPoolService } from '../cache/user-pool.service';
import { CurrentUser } from './current_user';
import { RequestContext } from './request_context';
import { CacheFactory } from '../cache/cache.factory';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    private readonly SCHEMA = 'cms_portal';

    constructor (
        private readonly jwtStrategy: JwtStrategy,
        private readonly tokenIntegrityValidator: TokenIntegrityValidator,
        private readonly userPoolService: UserPoolService,
        private readonly als: AsyncLocalStorage<RequestContext>,
        private readonly cacheFactory: CacheFactory,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const isPublicRoute = publicRoutes.some(route =>
            req.originalUrl.includes(route),
        );

        const isSseRoute = sseRoutes.some(route =>
            req.originalUrl.includes(route),
        );

        /**
         * ==========================
         * SSE ROUTES
         * ==========================
         */
        if (isSseRoute) {
            const token = (req.query?.token || req.query?.accessToken) as string;
            if (!token) {
                throw new ForbiddenException('Missing SSE access token');
            }

            const requestContext = await AuthTokenStrategy.parseToken(
                token,
                this.jwtStrategy,
                this.tokenIntegrityValidator,
                this.userPoolService,
            );

            const refreshedToken = await AuthTokenStrategy.updateToken(
                token,
                this.userPoolService,
                this.cacheFactory,
                req.originalUrl,
            );

            res.setHeader('X-XSRF-TOKEN', refreshedToken);

            // Force CMS schema
            const currentUser = requestContext.getCurrentUser();
            Object.defineProperty(currentUser, 'schema', {
                value: this.SCHEMA,
                writable: false,
            });

            this.als.enterWith(requestContext);
            return next();
        }

        /**
         * ==========================
         * PUBLIC ROUTES
         * ==========================
         */
        if (isPublicRoute) {
            const currentUser = new CurrentUser(
                '', // loginId
                '', // userId
                '', // fullName
                this.SCHEMA, // readonly schema
            );

            const requestContext = new RequestContext(currentUser);
            this.als.enterWith(requestContext);
            return next();
        }

        /**
         * ==========================
         * PROTECTED ROUTES
         * ==========================
         */
        const token = req.headers['x-xsrf-token'] as string;
        if (!token) {
            throw new ForbiddenException('Missing authentication token');
        }

        const requestContext = await AuthTokenStrategy.parseToken(
            token,
            this.jwtStrategy,
            this.tokenIntegrityValidator,
            this.userPoolService,
        );

        // Force CMS schema on CurrentUser (readonly)
        const currentUser = requestContext.getCurrentUser();
        Object.defineProperty(currentUser, 'schema', {
            value: this.SCHEMA,
            writable: false,
        });

        this.als.enterWith(requestContext);
        return next();
    }
}
