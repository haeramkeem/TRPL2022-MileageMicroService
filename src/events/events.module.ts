import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { UsersModule } from 'src/users/users.module';
import { PlacesModule } from 'src/places/places.module';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';
import { PlacesRepository } from 'src/places/places.repository';
import { PhotosRepository } from 'src/photos/photos.repository';
import { ReviewsRepository } from 'src/reviews/reviews.repository';
import { PointLogsRepository } from 'src/pointLogs';

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([
            PlacesRepository,
            PhotosRepository,
            ReviewsRepository,
            PointLogsRepository,
        ]),
        UsersModule,
        PlacesModule,
    ],
    controllers: [ EventsController ],
    providers: [ EventsService ]
})
export class EventsModule {}
