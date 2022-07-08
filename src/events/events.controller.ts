import { Controller, Post, Body, Res } from '@nestjs/common';
import { ReviewEventsService } from './review-events.service';
import { ActionType } from 'src/common/constants';
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
            switch(body.action) {
                case ActionType.ADD:
                    await this.reviewEventsService.create(body as CreateDto);
                    res.status(StatusCodes.CREATED).send({ error: null });
                    break;
                case ActionType.MOD:
                    await this.reviewEventsService.update(body as UpdateDto);
                    res.status(StatusCodes.OK).send({ error: null });
                    break;
                case ActionType.DEL:
                    await this.reviewEventsService.remove(body as RemoveDto);
                    res.status(StatusCodes.OK).send({ error: null });
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
