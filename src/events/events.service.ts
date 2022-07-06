import { Injectable } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto';
import { DataSource } from 'typeorm';
import { Review, PointLog } from './entities';
import { ActionType } from 'src/constants';
import { UsersService } from 'src/users/users.service';
import { PlacesService } from 'src/places/places.service';
import { PlacesRepository } from 'src/places/places.repository';
import { PhotosRepository } from 'src/photos/photos.repository';

@Injectable()
export class EventsService {
    constructor(
        private readonly usersService: UsersService,
        private readonly placesService: PlacesService,
        private readonly placesRepository: PlacesRepository,
        private readonly photosRepository: PhotosRepository,
        private dataSource: DataSource,
    ) {}

    async create(dto: CreateEventDto) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const review = new Review();
        review.id = dto.reviewId;
        review.content = dto.content;
        review.author = await this.usersService.findOne(dto.userId);
        review.place = await this.placesService.findOne(dto.placeId);

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
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .saveMany(dto.attachedPhotoIds, review);

            // Update place
            const updateResult = await queryRunner.manager
                .withRepository(this.placesRepository)
                .updateFirstReview(dto.placeId, dto.reviewId);
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
        let rollbackPoint = review.content.length > 0 ? 1 : 0;
        let commitPoint = dto.content.length > 0 ? 1 : 0;

        const photosRepositoryCtx = queryRunner.manager.withRepository(this.photosRepository);
        const existingPhotos = await photosRepositoryCtx.findByAttachedReview(review);

        rollbackPoint += existingPhotos.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        const newPhotosSet = new Set(dto.attachedPhotoIds);
        const existingPhotosSet = new Set(existingPhotos.map(photo => photo.id));

        const toDelete = existingPhotos.filter(photo => !newPhotosSet.has(photo.id));
        const toInsert = dto.attachedPhotoIds.filter(photo => !existingPhotosSet.has(photo));

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
            await photosRepositoryCtx.softDeleteMany(toDelete);

            // Insert photos
            await photosRepositoryCtx.saveMany(toInsert, review);

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
            console.error(err);
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
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .softCascadeMany(review);

            // Manual SET NULL for soft deleting review
            const updateResult = await queryRunner.manager
                .withRepository(this.placesRepository)
                .markAsDeleted(id);
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
            console.error(err);
            // TODO: rollback subscribed action
        } finally {
            // Defer
            await queryRunner.release();
        }
    }
}
