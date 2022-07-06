import { Injectable } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { DataSource, IsNull } from 'typeorm';
import { User, Place, Review, Photo, PointLog } from './entities';
import { ActionType } from 'src/constants';

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
        // TODO: user not found
        review.author = await queryRunner.manager.findOneBy(User, { id: dto.userId });
        // TODO: place not found
        review.place = await queryRunner.manager.findOneBy(Place, { id: dto.placeId });

        // Calc point
        let point = (await queryRunner.manager.findOne(PointLog, {
            where: { owner: review.author },
            order: { id: 'DESC' },
        }) || { point: 0 }).point;
        point += dto.content.length > 0 ? 1 : 0;
        point += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        // Start transaction
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
            const updateResult = await queryRunner.manager.update(Place, {
                id: dto.placeId,
                firstReview: IsNull(),
            }, {
                firstReview: review,
            });
            point += updateResult.affected > 0 ? 1 : 0;

            // Insert point log
            if (point > 0) {
                const pointLog = new PointLog();
                pointLog.owner = review.author;
                pointLog.action = ActionType.ADD;
                pointLog.point = point;
                await queryRunner.manager.save(pointLog);
            }

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            console.error(err);
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
