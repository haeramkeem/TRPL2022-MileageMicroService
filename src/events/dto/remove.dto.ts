import { PickType } from '@nestjs/mapped-types';
import { ReqBodyDto } from './reqBody.dto';

export class RemoveDto extends PickType(ReqBodyDto, [
    'reviewId',
    'userId',
    'placeId',
]) {}
