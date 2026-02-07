import status from 'http-status';
import { HttpException } from '@/utils/exceptions/common/http.exception';

// Bad Request
export class BadRequestException extends HttpException {
  constructor(message = 'Bad Request', details?: any) {
    super(status.BAD_REQUEST, message, details);
  }
}

// Unauthorized
export class UnauthorizedException extends HttpException {
  constructor(message: 'Unauthorized', details?: any) {
    super(status.UNAUTHORIZED, message, details);
  }
}

// Forbidden
export class ForbiddenException extends HttpException {
  constructor(message = 'Forbidden', details?: any) {
    super(status.FORBIDDEN, message, details);
  }
}

// Not Found
export class NotFoundException extends HttpException {
  constructor(message = 'Not Found', details?: any) {
    super(status.NOT_FOUND, message, details);
  }
}

// Conflict
export class ConflictException extends HttpException {
  constructor(message: 'Conflict', details?: any) {
    super(status.CONFLICT, message, details);
  }
}

// Internal Server Error
export class InternalServerErrorException extends HttpException {
  constructor(message = 'Internal Server Error', details?: any) {
    super(status.INTERNAL_SERVER_ERROR, message, details);
  }
}
