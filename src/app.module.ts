import { Module } from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { PlacesModule } from './places/places.module';
import { ReviewsModule } from './reviews/reviews.module';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            type:           'mysql',
            host:           process.env.DB_HOST,
            port:           parseInt(process.env.DB_PORT),
            username:       process.env.DB_USERNAME,
            password:       process.env.DB_PASSWORD,
            database:       process.env.DB_DATABASE,
            entities:       [__dirname + '/**/*.entity{.ts,.js}'],
            synchronize:    (process.env.NODE_ENV == "development"),
        }),
        UsersModule,
        PlacesModule,
        ReviewsModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {}
