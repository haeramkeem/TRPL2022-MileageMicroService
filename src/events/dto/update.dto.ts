import { PickType } from '@nestjs/mapped-types';
import { ReqBodyDto } from './req-body.dto';

export class UpdateDto extends PickType(ReqBodyDto, [
    'reviewId',
    'content',
    'attachedPhotoIds',
    'userId',
    'placeId',
]) {}
