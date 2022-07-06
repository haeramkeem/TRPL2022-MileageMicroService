import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import {Review} from 'src/reviews/entities/review.entity';
import { Place } from './entities/place.entity';
import { PlacesService } from './places.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Place, Review ])
    ],
    providers: [PlacesService],
    exports: [PlacesService]
})
export class PlacesModule {}
