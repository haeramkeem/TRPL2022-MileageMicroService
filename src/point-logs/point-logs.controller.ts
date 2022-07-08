import { Controller, Param, Get, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { ReqParamDto } from './dto/req-param.dto';
import { PointLogsService } from './point-logs.service';
import { StatusCodes as http } from 'http-status-codes';
import { UnhandledError } from 'src/common/errors';

@Controller('point')
export class PointLogsController {
    constructor(private readonly pointLogsService: PointLogsService) {}

    @Get('/:id')
    async getPoint(@Res() res: Response, @Param() reqParam: ReqParamDto) {
        this.pointLogsService
            .getLastPoint(reqParam.id)
            .then(point => res.status(http.OK).send({ error: null, point }))
            .catch(err => new UnhandledError(err).send(res));
    }
}
