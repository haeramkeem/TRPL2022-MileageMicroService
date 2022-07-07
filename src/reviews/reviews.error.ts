import { BadRequestError } from 'src/common/errors';

export class AddDuplicatedReviewError extends BadRequestError {
    constructor() {
        super('Review already exists');
    }
}

export class ReviewInvalidError extends BadRequestError {
    constructor() {
        super('Requested review is invalid');
    }
}
