import { Injectable } from '@nestjs/common';
import { PointLogsRepository } from './point-logs.repository';

@Injectable()
export class PointLogsService {
    constructor(
        private readonly pointLogsRepository: PointLogsRepository,
    ) {}

    async getLastPoint(id: string): Promise<number> {
        return (await this
            .pointLogsRepository
            .safelyFindOneByOwnerId(id))
            .point;
    }
}
