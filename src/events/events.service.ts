import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DataSource } from 'typeorm';
import { User, Place, Review, Photo } from './entities';

@Injectable()
export class EventsService {
    constructor(
        private dataSource: DataSource,
    ) {}

    async create(dto: CreateEventDto) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const review = new Review();
        review.id = dto.reviewId;
        review.content = dto.content;
        review.author = await queryRunner.manager.findOneBy(User, { id: dto.userId }); // TODO: user not found
        review.place = await queryRunner.manager.findOneBy(Place, { id: dto.placeId }); // TODO: place not found
        await queryRunner.startTransaction()

        try {
            // Insert review
            // TODO: subscribe to save review event
            await queryRunner.manager.save(review);

            // Insert photos
            // TODO: subscribe to save photo event
            await queryRunner.manager.save(dto.attachedPhotoIds.map(photoId => {
                const photo = new Photo();
                photo.id = photoId;
                // photo.attachedReview = review;
                return photo;
            }));

            // Update place
            // TODO: subscribe to update place event
            await queryRunner.manager.update(Place, {
                id: dto.placeId,
                firstReview: undefined, // TODO: firstReview will be either null or undefined
            }, {
                firstReview: review,
            });

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    update(id: string, updateEventDto: UpdateEventDto) {
        return `This action updates a #${id} event`;
    }

    remove(id: string) {
        return `This action removes a #${id} event`;
    }
}
