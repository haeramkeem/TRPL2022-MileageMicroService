import { BadRequestError } from 'src/common/errors';

export class AddDuplicatedPhotoError extends BadRequestError {
    constructor() {
        super('Photo already exists');
    }
}
