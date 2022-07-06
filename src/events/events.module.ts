import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';

@Module({
    imports: [ TypeOrmModule.forFeature([
        entities.Review,
        entities.Photo,
        entities.User,
        entities.Place,
        entities.PointLog
    ]) ],
    controllers: [ EventsController ],
    providers: [ EventsService ]
})
export class EventsModule {}
