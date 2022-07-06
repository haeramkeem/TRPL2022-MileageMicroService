import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Place } from './entities/place.entity';
import { PlacesService } from './places.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([ Place ])
    ],
    providers: [PlacesService],
    exports: [PlacesService]
})
export class PlacesModule {}
