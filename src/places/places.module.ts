import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { ReviewsModule } from 'src/reviews/reviews.module';

@Module({
    imports:    [
        TypeOrmModule.forFeature([ Place ]),
        ReviewsModule,
    ],
    providers:  [ PlacesService ],
    exports:    [ PlacesService ]
})
export class PlacesModule {}
