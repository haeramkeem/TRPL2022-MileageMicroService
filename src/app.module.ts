import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventsModule } from './events/events.module';
import { PointLogsModule } from './point-logs/point-logs.module';

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
        EventsModule,
        PointLogsModule,
    ],
})
export class AppModule {}
