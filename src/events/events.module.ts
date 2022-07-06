import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as entities from './entities';
import { UsersModule } from 'src/users/users.module';
import { PlacesModule } from 'src/places/places.module';
import { TypeOrmExModule } from 'src/typeorm-ex/typeorm-ex.module';
import { PlacesRepository } from 'src/places/places.repository';
import { PhotosRepository } from 'src/photos/photos.repository';
import { ReviewsRepository } from 'src/reviews/reviews.repository';

@Module({
    imports: [
        TypeOrmExModule.forCustomRepository([
            PlacesRepository,
            PhotosRepository,
            ReviewsRepository,
        ]),
        TypeOrmModule.forFeature([
            entities.PointLog
        ]),
        UsersModule,
        PlacesModule,
    ],
    controllers: [ EventsController ],
    providers: [ EventsService ]
})
export class EventsModule {}
