import { IsUUID } from 'class-validator';

export class ReqParamDto {
    @IsUUID()
    id: string;
}
