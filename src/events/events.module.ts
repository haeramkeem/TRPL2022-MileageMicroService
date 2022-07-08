import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';
import { PlacesRepository } from 'src/places/places.repository';
import { PhotosRepository } from 'src/photos/photos.repository';
import { ReviewsRepository } from 'src/reviews/reviews.repository';
import { PointLogsRepository } from 'src/point-logs';
import { UsersRepository } from 'src/users';

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([
            UsersRepository,
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
