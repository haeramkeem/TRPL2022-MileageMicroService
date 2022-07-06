import { Injectable } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto';
import { DataSource, IsNull } from 'typeorm';
import { Place, Review, Photo, PointLog } from './entities';
import { ActionType } from 'src/constants';
import {UsersService} from 'src/users/users.service';

@Injectable()
export class EventsService {
    constructor(
        private readonly usersService: UsersService,
        private dataSource: DataSource,
    ) {}

    async create(dto: CreateEventDto) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const review = new Review();
        review.id = dto.reviewId;
        review.content = dto.content;
        review.author = await this.usersService.findOne(dto.userId);
        // TODO: place not found
        review.place = await queryRunner.manager.findOneBy(Place, { id: dto.placeId });

        // Calc point
        const point = (await queryRunner.manager.findOne(PointLog, {
            where: { owner: review.author },
            order: { id: 'DESC' },
        }) || { point: 0 }).point;

        let commitPoint = 0;
        commitPoint += dto.content.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

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
            commitPoint += updateResult.affected > 0 ? 1 : 0;

            // Insert point log
            if (commitPoint > 0) {
                const pointLog = new PointLog();
                pointLog.owner = review.author;
                pointLog.action = ActionType.ADD;
                pointLog.point = point + commitPoint;
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

        // TODO: Review not found
        const review = await queryRunner.manager.findOne(Review, {
            where: { id },
            relations: ['author'],
        });
        console.log(review);
        let rollbackPoint = review.content.length > 0 ? 1 : 0;
        let commitPoint = dto.content.length > 0 ? 1 : 0;

        const existingPhotos = (await queryRunner.manager.findBy(Photo, {
            attachedReview: review
        })).map(photo => photo.id);
        rollbackPoint += existingPhotos.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        const newPhotosSet = new Set(dto.attachedPhotoIds);
        const existingPhotosSet = new Set(existingPhotos);

        const toDelete = existingPhotos.filter(x => !newPhotosSet.has(x));
        const toInsert = dto.attachedPhotoIds.filter(x => !existingPhotosSet.has(x));

        // Calc point
        const point = (await queryRunner.manager.findOne(PointLog, {
            where: { owner: review.author },
            order: { id: 'DESC' },
        }) || { point: 0 }).point;

        // Start transaction
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

            // Insert point log
            if (rollbackPoint != commitPoint) {
                const pointLog = new PointLog();
                pointLog.owner = review.author;
                pointLog.action = ActionType.MOD;
                pointLog.point = point - rollbackPoint + commitPoint;
                await queryRunner.manager.save(pointLog);
            }

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

        const review = await queryRunner.manager.findOne(Review, {
            where: { id },
            relations: [ 'author', 'photos' ],
        });

        // Calc point
        const point = (await queryRunner.manager.findOne(PointLog, {
            where: { owner: review.author },
            order: { id: 'DESC' },
        }) || { point: 0 }).point;

        let rollbackPoint = 0;
        rollbackPoint += review.content.length > 0 ? 1 : 0;
        rollbackPoint += review.photos.length > 0 ? 1 : 0;

        // Start transaction
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
            const updateResult = await queryRunner.manager.update(Place, {
                firstReview: review,
            }, {
                firstReview: null,
            });

            rollbackPoint += updateResult.affected > 0 ? 1 : 0;
            // Insert point log
            if (rollbackPoint > 0) {
                const pointLog = new PointLog();
                pointLog.owner = review.author;
                pointLog.action = ActionType.MOD;
                pointLog.point = point - rollbackPoint;
                await queryRunner.manager.save(pointLog);
            }

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
