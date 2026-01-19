import { ErrorDetail } from './error_detail';

export class Error {
  type: Type;
  errors: ErrorDetail[];

  constructor(type: Type, errors: ErrorDetail[]) {
    this.type = type;
    this.errors = errors;
  }

  static create(type: Type, error: ErrorDetail): Error {
    const errors: ErrorDetail[] = [error];
    return new Error(type, errors);
  }
}

export enum Type {
  CONSTRAIN_VIOLATION_FAILED,
  TECHNICAL_ERROR,
  BUSINESS_VALIDATION_FAILED,
  NOT_FOUND,
  NOT_DEFINE,
  INVALID_REQUEST,
}
