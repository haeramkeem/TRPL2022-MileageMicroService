import { IsString, IsUUID } from 'class-validator';

export class FindOneDto {
    @IsUUID()
    id: string;

    @IsUUID()
    userId: string;

    @IsUUID()
    placeId: string;

    @IsString({ each: true })
    relations: string[];
}
