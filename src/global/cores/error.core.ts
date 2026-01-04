import { StatusCodes } from "http-status-codes";

abstract class CustomError extends Error {
    abstract status: string;
    abstract statusCode: number;

    constructor(message: string) {
        super(message)
    }
}

export class ForbiddenException extends CustomError {
    status: string = "error";
    statusCode: number = StatusCodes.FORBIDDEN;

    constructor(message: string) {
        super(message);
    }
}

export class BadRequestException extends CustomError {
    status: string = 'error';
    statusCode: number = StatusCodes.BAD_REQUEST;

    constructor(message: string) {
        super(message);
    }
}

export class UnAuthorizedException extends CustomError {
    status: string = 'error';
    statusCode: number = StatusCodes.UNAUTHORIZED;

    constructor(message: string) {
        super(message);
    }
}

export class NotFoundException extends CustomError {
    status: string = 'error';
    statusCode: number = StatusCodes.NOT_FOUND;

    constructor(message: string) {
        super(message);
    }
}

export class InternalServerException extends CustomError {
    status: string = 'error';
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;

    constructor(message: string) {
        super(message);
    }
}