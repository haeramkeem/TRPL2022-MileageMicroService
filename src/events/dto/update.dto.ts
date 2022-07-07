import { PickType } from '@nestjs/mapped-types';
import { ReqBodyDto } from './reqBody.dto';

export class UpdateDto extends PickType(ReqBodyDto, [
    'reviewId',
    'content',
    'attachedPhotoIds',
    'userId',
    'placeId',
]) {}
