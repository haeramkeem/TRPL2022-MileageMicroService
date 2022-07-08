import { Controller, Query, Get, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReqQueryDto } from './dto/req-query.dto';
import { PointLogsService } from './point-logs.service';
import { StatusCodes as http } from 'http-status-codes';
import { BaseError, UnhandledError } from 'src/common/errors';

@Controller('point')
export class PointLogsController {
    constructor(private readonly pointLogsService: PointLogsService) {}

    @Get()
    async getPoint(@Res() res: Response, @Query() reqQuery: ReqQueryDto) {
        this.pointLogsService
            .getLastPoint(reqQuery.owner)
            .then(point => res.status(http.OK).send({ error: null, point }))
            .catch(err => {
                if (err instanceof BaseError) err.send(res);
                new UnhandledError(err).send(res)
            });
    }
}
