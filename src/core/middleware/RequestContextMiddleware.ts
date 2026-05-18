import { publicRoutes, sseRoutes } from '@app/feature/common/publicRoutes';
import {
    BadRequestException,
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
import { SystemsConstant } from '../constants/systems.constant';

@Injectable()
export class RequestContextMiddleware implements NestMiddleware {
    private readonly SCHEMA = SystemsConstant.SHARED_KEYSPACE;

    constructor (
        private readonly jwtStrategy: JwtStrategy,
        private readonly tokenIntegrityValidator: TokenIntegrityValidator,
        private readonly userPoolService: UserPoolService,
        private readonly als: AsyncLocalStorage<RequestContext>,
        private readonly cacheFactory: CacheFactory,
    ) { }

    async use(req: Request, res: Response, next: NextFunction) {
        const originalUrl = req.originalUrl || '';
        const isPublicRoute = publicRoutes.some((route) =>
            originalUrl.includes(route),
        );
        const isSseRoute = sseRoutes.some((route) => originalUrl.includes(route));
        const clientCode = this.getClientCodeFromHeader(req);
        const requiresClientCode = this.requiresClientHeader(originalUrl);

        if (requiresClientCode && !clientCode) {
            throw new ForbiddenException('Missing X-Client-Code header');
        }

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
                originalUrl,
            );

            res.setHeader('X-XSRF-TOKEN', refreshedToken);

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
                '',
                '',
                '',
                this.SCHEMA,
                '',
                clientCode,
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

        const currentUser = requestContext.getCurrentUser();
        Object.defineProperty(currentUser, 'schema', {
            value: this.SCHEMA,
            writable: false,
        });

        this.als.enterWith(requestContext);
        return next();
    }

    private requiresClientHeader(originalUrl: string): boolean {
        return originalUrl.includes('/auth/login');
    }

    private getClientCodeFromHeader(req: Request): string | undefined {
        const rawValue =
            (req.headers['x-client-code'] ||
                req.headers['client-code'] ||
                req.headers['clientcode']) as string;
        if (!rawValue) {
            return undefined;
        }
        const normalized = rawValue.trim();
       if (!/^[a-zA-Z0-9]{3,4}$/.test(normalized)) {
    throw new BadRequestException('Client code must be 3 or 4 characters (letters or numbers)');
}
        return normalized;
    }
}
