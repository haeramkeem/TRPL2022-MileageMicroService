import { Controller, Post, Body } from '@nestjs/common';
import { EventsService } from './events.service';
import { ActionType } from 'src/constants';
import * as dto from './dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    async post(@Body() body: dto.PostEventDto) {
        try {
            switch(body.action) {
                case ActionType.ADD:
                    return await this.eventsService.create(body as dto.CreateEventDto);
                case ActionType.MOD:
                    return this.eventsService.update(body.reviewId, body as dto.UpdateEventDto);
                case ActionType.DEL:
                    return this.eventsService.remove(body.reviewId);
            }
        } catch(err) {
            // TODO: General error handling
        }
    }
}
