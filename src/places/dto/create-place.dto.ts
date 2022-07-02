import { IsOptional, IsUUID } from "class-validator";


export class CreatePlaceDto {
    @IsUUID()
    id: string;

    @IsUUID()
    @IsOptional()
    firstReviewId: string;
}
