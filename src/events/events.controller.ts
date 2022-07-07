import { Controller, Post, Body, Res } from '@nestjs/common';
import { EventsService } from './events.service';
import { ActionType } from 'src/common/constants';
import { Response } from 'express';
import { BaseError, UnhandledError } from 'src/common/errors';
import * as dto from './dto';

@Controller('events')
export class EventsController {
    constructor(private readonly eventsService: EventsService) {}

    @Post()
    async post(
        @Res()  res:    Response,
        @Body() body:   dto.PostEventDto) {
        try {
            switch(body.action) {
                case ActionType.ADD:
                    await this.eventsService.create(body as dto.CreateEventDto);
                case ActionType.MOD:
                    await this.eventsService.update(body.reviewId, body as dto.UpdateEventDto);
                case ActionType.DEL:
                    await this.eventsService.remove(body.reviewId);
            }
            res.send({ error: null });
        } catch(err) {
            if (err instanceof BaseError) {
                err.send(res);
            } else {
                new UnhandledError(err).send(res);
            }
        }
    }
}
