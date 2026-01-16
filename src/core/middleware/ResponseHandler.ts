import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { map, Observable } from 'rxjs';
import { Result } from '@app/feature/common/result';
import { AuthTokenStrategy } from '../auth/authtoken.strategy';
import { publicRoutes, sseRoutes } from '@app/feature/common/publicRoutes';
import { FileResult } from '@app/feature/common/file-result';
import { UserPoolService } from '../cache/user-pool.service';
import { CacheFactory } from '../cache/cache.factory';

@Injectable()
export class ResponseHandler implements NestInterceptor {
    constructor(private userPoolService: UserPoolService, private cacheServiceFactory: CacheFactory) {}
    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const [req, res] = context.getArgs();
        const request = context.switchToHttp().getRequest();
        const token = context.switchToHttp().getRequest().headers['x-xsrf-token'];

        const isRoutesSSE = sseRoutes.some((route) => request.originalUrl.includes(route));

        if (isRoutesSSE) {
            return next.handle();
        }
        return next.handle().pipe(
            map(async (data) => {
                if (token) {
                    const request = context.switchToHttp().getRequest();
                    const isExcludedRoute = publicRoutes.some((route) => request.originalUrl.includes(route));
                    if (!isExcludedRoute) {
                        const newToken = await AuthTokenStrategy.updateToken(token, this.userPoolService, this.cacheServiceFactory,request.originalUrl);
                        context.switchToHttp().getResponse().setHeader('X-XSRF-TOKEN', newToken);
                    }
                }

                if (data && data instanceof Result) {
                    if (data.isSuccess) {
                        context.switchToHttp().getResponse().statusCode = 200;
                    }
                    return {
                        code: data['code'],
                        message: data['message'],
                        data: data['data']
                    };
                } else if (data && data instanceof FileResult) {
                    context
                        .switchToHttp()
                        .getResponse()
                        .setHeader('Content-Type', data.contentType)
                        .setHeader('Content-Disposition', `attachment; filename=${data.fileName}`)
                        .setHeader('Content-Length', data.buffer.length)
                        .setHeader('Access-Control-Expose-Headers', 'Content-Disposition');
                    res.send(data.buffer);
                    return data.buffer;
                } else {
                    return {
                        code: context.switchToHttp().getResponse().statusCode,
                        message: data
                    };
                }
            })
        );
    }
}
