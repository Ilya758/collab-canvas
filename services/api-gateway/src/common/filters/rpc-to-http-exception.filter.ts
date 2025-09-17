import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  HttpException,
} from '@nestjs/common';
import { status as GrpcStatus } from '@grpc/grpc-js';
import { Response } from 'express';

interface RpcError {
  code: number;
  details?: string;
  message?: string;
}

@Catch()
export class RpcToHttpExceptionFilter implements ExceptionFilter {
  private static readonly grpcToHttpStatus: Record<number, number> = {
    [GrpcStatus.OK]: HttpStatus.OK,
    [GrpcStatus.CANCELLED]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.UNKNOWN]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.INVALID_ARGUMENT]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.DEADLINE_EXCEEDED]: HttpStatus.GATEWAY_TIMEOUT,
    [GrpcStatus.NOT_FOUND]: HttpStatus.NOT_FOUND,
    [GrpcStatus.ALREADY_EXISTS]: HttpStatus.CONFLICT,
    [GrpcStatus.PERMISSION_DENIED]: HttpStatus.FORBIDDEN,
    [GrpcStatus.UNAUTHENTICATED]: HttpStatus.UNAUTHORIZED,
    [GrpcStatus.RESOURCE_EXHAUSTED]: HttpStatus.TOO_MANY_REQUESTS,
    [GrpcStatus.FAILED_PRECONDITION]: HttpStatus.PRECONDITION_FAILED,
    [GrpcStatus.ABORTED]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.OUT_OF_RANGE]: HttpStatus.BAD_REQUEST,
    [GrpcStatus.UNIMPLEMENTED]: HttpStatus.NOT_IMPLEMENTED,
    [GrpcStatus.INTERNAL]: HttpStatus.INTERNAL_SERVER_ERROR,
    [GrpcStatus.UNAVAILABLE]: HttpStatus.SERVICE_UNAVAILABLE,
    [GrpcStatus.DATA_LOSS]: HttpStatus.INTERNAL_SERVER_ERROR,
  };

  catch(exception: RpcError | HttpException, host: ArgumentsHost) {
    if (exception instanceof HttpException) {
      throw exception;
    }

    const response = host.switchToHttp().getResponse<Response>();

    if (typeof exception.code !== 'number') {
      const httpStatus = HttpStatus.INTERNAL_SERVER_ERROR;
      throw new HttpException('An unexpected error occurred.', httpStatus);
    }

    const message =
      exception.details || exception.message || 'An unexpected error occurred.';
    const httpStatus =
      RpcToHttpExceptionFilter.grpcToHttpStatus[exception.code] ||
      HttpStatus.INTERNAL_SERVER_ERROR;

    response.status(httpStatus).json({
      statusCode: httpStatus,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
