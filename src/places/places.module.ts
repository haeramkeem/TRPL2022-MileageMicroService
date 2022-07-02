import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { Review } from 'src/reviews/entities/review.entity';

@Module({
    imports:    [ TypeOrmModule.forFeature([ Place, Review ]) ],
    providers:  [ PlacesService ],
    exports:    [ PlacesService ]
})
export class PlacesModule {}
