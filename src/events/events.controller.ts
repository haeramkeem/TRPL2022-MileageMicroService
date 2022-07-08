import { Controller, Post, Body, Res } from '@nestjs/common';
import { ReviewEventsService } from './review-events.service';
import { EventsType, EventsActionType } from './events.constant';
import { Response } from 'express';
import { BaseError, UnhandledError } from 'src/common/errors';
import { ReqBodyDto, CreateDto, UpdateDto, RemoveDto } from './dto';
import { StatusCodes } from 'http-status-codes';

@Controller('events')
export class EventsController {
    constructor(private readonly reviewEventsService: ReviewEventsService) {}

    @Post()
    async post(
        @Res()  res:    Response,
        @Body() body:   ReqBodyDto) {
        try {
            switch(body.type) {
                case EventsType.REVIEW:
                switch(body.action) {
                    case EventsActionType.ADD:
                    await this.reviewEventsService.create(body as CreateDto);
                    res.status(StatusCodes.CREATED).send({ error: null });
                    break;

                    case EventsActionType.MOD:
                    await this.reviewEventsService.update(body as UpdateDto);
                    res.status(StatusCodes.OK).send({ error: null });
                    break;

                    case EventsActionType.DEL:
                    await this.reviewEventsService.remove(body as RemoveDto);
                    res.status(StatusCodes.OK).send({ error: null });
                    break;
                }
                break;
            }
        } catch(err) {
            if (err instanceof BaseError) {
                err.send(res);
            } else {
                new UnhandledError(err).send(res);
            }
        }
    }
}
