import { BadRequestError } from 'src/common/errors';

export class PointNotFoundError extends BadRequestError {
    constructor() {
        super('Requested point not found');
    }
}
