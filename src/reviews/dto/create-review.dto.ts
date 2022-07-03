import { IsString, IsUUID } from "class-validator";

export class CreateReviewDto {
    @IsUUID()
    reviewId: string;

    @IsUUID()
    authorId: string;

    @IsUUID()
    placeId: string;

    @IsString()
    content: string;
}
