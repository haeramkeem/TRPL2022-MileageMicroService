import { IsUUID } from 'class-validator';

export class UpdatePlaceDto {
    @IsUUID()
    placeId: string;

    @IsUUID()
    firstReviewId: string;
}
