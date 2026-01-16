import { Result } from '@app/feature/common/result';
import { RequestContext } from '../middleware/request_context';

import { UsecaseRequest } from './usecase.request';
import { UsecaseResponse } from './usecase.response';

export interface Usecase<I extends UsecaseRequest, U extends UsecaseResponse> {
  execute(request: I, requestContext?:RequestContext): Promise<Result<U>>;
}
