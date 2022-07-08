import { IsUUID } from 'class-validator';

export class ReqQueryDto {
    @IsUUID()
    owner: string;
}
