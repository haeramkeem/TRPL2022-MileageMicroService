import { Injectable } from '@nestjs/common';
import { CreateEventDto, UpdateEventDto } from './dto';
import { DataSource, Repository } from 'typeorm';
import { ActionType } from 'src/common/constants';
import { PlacesRepository } from 'src/places';
import { PhotosRepository } from 'src/photos';
import { ReviewsRepository, Review } from 'src/reviews';
import { PointLogsRepository } from 'src/pointLogs';
import { User } from 'src/users';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EventsService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
        private readonly placesRepository: PlacesRepository,
        private readonly photosRepository: PhotosRepository,
        private readonly reviewsRepository: ReviewsRepository,
        private readonly pointLogRepository: PointLogsRepository,
        private dataSource: DataSource,
    ) {}

    async create(dto: CreateEventDto) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const review = new Review();
        review.id = dto.reviewId;
        review.content = dto.content;
        review.author = await this.usersRepository.findOneBy({ id: dto.userId });
        review.place = await this.placesRepository.findOneBy({ id: dto.placeId });

        // Calc point
        let commitPoint = 0;
        commitPoint += dto.content.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        // Start transaction
        await queryRunner.startTransaction();

        try {
            // Insert review
            await queryRunner.manager
                .withRepository(this.reviewsRepository)
                .saveDistinct(review);

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
            await queryRunner.manager
                .withRepository(this.pointLogRepository)
                .saveOne(review.author, ActionType.ADD, commitPoint);

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // Re-thorw error to be able to catch in controller layer
            throw err;
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    async update(id: string, dto: UpdateEventDto) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const reviewsRepositoryCtx = queryRunner.manager.withRepository(this.reviewsRepository);
        const photosRepositoryCtx = queryRunner.manager.withRepository(this.photosRepository);

        const review = await reviewsRepositoryCtx.findOneWithRelated(id, ['author']);
        let rollbackPoint = review.content.length > 0 ? 1 : 0;
        let commitPoint = dto.content.length > 0 ? 1 : 0;

        const existingPhotos = await photosRepositoryCtx.findWithAttachedReview(review);
        rollbackPoint += existingPhotos.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        const newPhotosSet = new Set(dto.attachedPhotoIds);
        const existingPhotosSet = new Set(existingPhotos.map(photo => photo.id));

        const toDelete = existingPhotos.filter(photo => !newPhotosSet.has(photo.id));
        const toInsert = dto.attachedPhotoIds.filter(photo => !existingPhotosSet.has(photo));

        // Start transaction
        await queryRunner.startTransaction();

        try {
            // Update content
            await reviewsRepositoryCtx.updateContent(id, dto.content);

            // Soft delete unattached photos
            await photosRepositoryCtx.softDeleteMany(toDelete);

            // Insert photos
            await photosRepositoryCtx.saveMany(toInsert, review);

            // Insert point log
            await queryRunner.manager
                .withRepository(this.pointLogRepository)
                .saveOne(review.author, ActionType.MOD, commitPoint - rollbackPoint);

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            console.error(err);
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    async remove(id: string) {
        const queryRunner = this.dataSource.createQueryRunner(); // TODO: QueryRunnerFactory
        await queryRunner.connect();

        const reviewsRepositoryCtx = queryRunner.manager.withRepository(this.reviewsRepository);
        const review = await reviewsRepositoryCtx.findOneWithRelated(id, ['author', 'photos']);

        let rollbackPoint = 0;
        rollbackPoint += review.content.length > 0 ? 1 : 0;
        rollbackPoint += review.photos.length > 0 ? 1 : 0;

        // Start transaction
        await queryRunner.startTransaction();

        try {
            // Soft delete review
            await reviewsRepositoryCtx.softDelete({ id });

            // Manual cascade for soft deleting review
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .softCascadeMany(review);

            // Manual SET NULL for soft deleting review
            const updateResult = await queryRunner.manager
                .withRepository(this.placesRepository)
                .softDeleteOne(id);
            rollbackPoint += updateResult.affected > 0 ? 1 : 0;

            // Insert point log
            await queryRunner.manager
                .withRepository(this.pointLogRepository)
                .saveOne(review.author, ActionType.DEL, -rollbackPoint);

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            console.error(err);
        } finally {
            // Defer
            await queryRunner.release();
        }
    }
}
