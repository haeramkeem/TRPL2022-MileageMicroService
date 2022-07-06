import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import { UsersModule } from 'src/users/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            entities.Review,
            entities.Photo,
            entities.Place,
            entities.PointLog
        ]),
        UsersModule,
    ],
    controllers: [ EventsController ],
    providers: [ EventsService ]
})
export class EventsModule {}
