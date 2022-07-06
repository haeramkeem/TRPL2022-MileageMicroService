import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';
import { User } from 'src/users';
import { PlacesRepository } from 'src/places/places.repository';
import { PhotosRepository } from 'src/photos/photos.repository';
import { ReviewsRepository } from 'src/reviews/reviews.repository';
import { PointLogsRepository } from 'src/pointLogs';

@Module({
    imports: [
        TypeOrmModule.forFeature([ User ]),
        TypeOrmExModule.forCustomRepository([
            PlacesRepository,
            PhotosRepository,
            ReviewsRepository,
            PointLogsRepository,
        ]),
    ],
    controllers: [ EventsController ],
    providers: [ EventsService ]
})
export class EventsModule {}
