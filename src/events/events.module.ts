import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import {TypeOrmModule} from '@nestjs/typeorm';
import { Review, Photo, User, Place } from './entities';

@Module({
    imports: [ TypeOrmModule.forFeature([ Review, Photo, User, Place ]) ],
    controllers: [EventsController],
    providers: [EventsService]
})
export class EventsModule {}
