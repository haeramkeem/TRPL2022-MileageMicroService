import { PartialType } from '@nestjs/mapped-types';
import { IsUUID } from 'class-validator';
import { CreatePlaceDto } from './create-place.dto';

export class UpdatePlaceDto extends PartialType(CreatePlaceDto) {
    @IsUUID()
    firstReviewId: string;
}
