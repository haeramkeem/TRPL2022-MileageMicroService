import { PickType } from '@nestjs/mapped-types';
import { ReqBodyDto } from './reqBody.dto';

export class CreateDto extends PickType(ReqBodyDto, [
    'reviewId',
    'content',
    'attachedPhotoIds',
    'userId',
    'placeId',
]) {}
