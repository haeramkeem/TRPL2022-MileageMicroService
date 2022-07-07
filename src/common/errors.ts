import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import { Response } from 'express';

export class BaseError extends Error {
    httpStatusCode: number;
    httpStatusMessage: string;

    constructor(code: number, errMsg: string) {
        super(errMsg);
        this.httpStatusCode = code;
        this.httpStatusMessage = getReasonPhrase(code);
    }

    send(res: Response) {
        res.status(this.httpStatusCode).send({
            error: {
                http: this.httpStatusMessage,
                server: this.toString(),
            }
        });
    }
}

// -------------------------
// 400~
// -------------------------
export class BadRequest extends BaseError {
    constructor(errMsg: string) {
        super(StatusCodes.BAD_REQUEST, errMsg);
    }
}

export class AddDuplicatedReviewError extends BadRequest {
    constructor() {
        super("Review already exists");
    }
}

// -------------------------
// 500~
// -------------------------
export class UnhandledError extends BaseError {
    constructor(err: Error) {
        console.error(err.stack);
        super(StatusCodes.INTERNAL_SERVER_ERROR, err.message);
    }
}
