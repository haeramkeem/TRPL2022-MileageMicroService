// Example request body
// {
//     "type": "REVIEW",
//     "action": "ADD", [> "MOD", "DELETE" <]
//     "reviewId": "240a0658-dc5f-4878-9381-ebb7b2667772",
//     "content": "good!",
//     "attachedPhotoIds": ["e4d1a64e-a531-46de-88d0-ff0ed70c0bb8", "afb0cef2-851d-4a50-bb07-9cc15cbdc332"],
//     "userId": "3ede0ef2-92b7-4817-a5f3-0c575361f745",
//     "placeId": "2e4baf1c-5acb-4efb-a1af-eddada31b00f"
// }

import { IsEnum, IsString, IsUUID } from 'class-validator';
import { EventsType, EventsActionType } from '../events.constant';

export class ReqBodyDto {
    @IsEnum(EventsType)
    type: string;

    @IsEnum(EventsActionType)
    action: string;

    @IsUUID()
    reviewId: string;

    @IsString()
    content: string;

    @IsUUID('all', { each: true })
    attachedPhotoIds: string[];

    @IsUUID()
    userId: string;

    @IsUUID()
    placeId: string;
}
