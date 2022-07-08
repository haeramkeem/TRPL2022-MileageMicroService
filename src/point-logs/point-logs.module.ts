import { Module } from '@nestjs/common';
import { PointLogsService } from './point-logs.service';
import { PointLogsController } from './point-logs.controller';
import { PointLogsRepository } from './point-logs.repository';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([ PointLogsRepository ])
    ],
    providers: [PointLogsService],
    controllers: [PointLogsController]
})
export class PointLogsModule {}
