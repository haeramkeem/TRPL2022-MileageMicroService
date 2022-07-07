import { BadRequestError } from 'src/common/errors';

export class UserInvalidError extends BadRequestError {
    constructor() {
        super('Requested user is invalid');
    }
}
