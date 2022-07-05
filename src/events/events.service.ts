import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DataSource, IsNull } from 'typeorm';
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
        await queryRunner.startTransaction();

        try {
            // Insert review
            // TODO: subscribe to save review event
            await queryRunner.manager.save(review);

            // Insert photos
            // TODO: subscribe to save photo event
            await queryRunner.manager.save(dto.attachedPhotoIds.map(photoId => {
                const photo = new Photo();
                photo.id = photoId;
                photo.attachedReview = review;
                return photo;
            }));

            // Update place
            // TODO: subscribe to update place event
            await queryRunner.manager.update(Place, {
                id: dto.placeId,
                firstReview: IsNull(),
            }, {
                firstReview: review,
            });

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // TODO: rollback subscribed action
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    async update(id: string, dto: UpdateEventDto) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const review = await queryRunner.manager.findOneBy(Review, { id });

        const existingPhotos = (await queryRunner.manager.findBy(Photo, {
            attachedReview: review
        })).map(photo => photo.id);

        const newPhotosSet = new Set(dto.attachedPhotoIds);
        const existingPhotosSet = new Set(existingPhotos);

        const toDelete = existingPhotos.filter(x => !newPhotosSet.has(x));
        const toInsert = dto.attachedPhotoIds.filter(x => !existingPhotosSet.has(x));
        await queryRunner.startTransaction();

        try {
            // Update content
            // TODO: subscribe to review content update
            await queryRunner.manager.update(Review, { id }, { content: dto.content });

            // Soft delete unattached photos
            // TODO: subscribe to delete photo event
            toDelete.forEach(async (id) => {
                await queryRunner.manager.softDelete(Photo, { id });
            });

            // Insert photos
            // TODO: subscribe to save photo event
            toInsert.forEach(async (id) => {
                const photo = new Photo();
                photo.id = id;
                photo.attachedReview = review;
                await queryRunner.manager.save(photo);
            });

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // TODO: rollback subscribed action
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    async remove(id: string) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const review = await queryRunner.manager.findOneBy(Review, { id });
        await queryRunner.startTransaction();

        try {
            // Soft delete review
            // TODO: subscribe to delete review
            await queryRunner.manager.softDelete(Review, { id });

            // Manual cascade for soft deleting review
            // TODO: subscribe to delete photo event
            await queryRunner.manager.softDelete(Photo, { attachedReview: review });

            // Manual SET NULL for soft deleting review
            // TODO: subscribe to update place event
            await queryRunner.manager.update(Place, {
                firstReview: review,
            }, {
                firstReview: null,
            });

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // TODO: rollback subscribed action
        } finally {
            // Defer
            await queryRunner.release();
        }
    }
}
