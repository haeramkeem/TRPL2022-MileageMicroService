import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { UsersModule } from 'src/users/users.module';
import { PlacesModule } from 'src/places/places.module';

@Module({
    imports:[
        UsersModule,
        PlacesModule,
    ],
    providers: [ ReviewsService ],
    exports: [ ReviewsService ]
})
export class ReviewsModule {}
