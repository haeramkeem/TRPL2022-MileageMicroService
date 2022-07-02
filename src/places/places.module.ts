import { Module } from '@nestjs/common';
import { PlacesService } from './places.service';

@Module({
    providers: [PlacesService]
})
export class PlacesModule {}
