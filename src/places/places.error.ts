import { BadRequestError } from 'src/common/errors';

export class PlaceInvalidError extends BadRequestError {
    constructor() {
        super('Requested place is invalid');
    }
}
