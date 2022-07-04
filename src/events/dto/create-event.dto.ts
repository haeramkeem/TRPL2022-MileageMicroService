import { OmitType } from '@nestjs/mapped-types';
import { PostEventDto } from './post-event.dto';

export class CreateEventDto extends OmitType(PostEventDto, [ 'type', 'action' ]) {}
