import { PickType } from '@nestjs/mapped-types';
import { PostEventDto } from './post-event.dto';

export class UpdateEventDto extends PickType(PostEventDto, [
    'content',
    'attachedPhotoIds',
]) {}
