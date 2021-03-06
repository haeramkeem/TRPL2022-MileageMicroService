import { PickType } from '@nestjs/mapped-types';
import { ReqBodyDto } from './req-body.dto';

export class RemoveDto extends PickType(ReqBodyDto, [
    'reviewId',
    'userId',
    'placeId',
]) {}
