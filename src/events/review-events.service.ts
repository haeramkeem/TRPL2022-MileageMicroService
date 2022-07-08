import { Injectable } from '@nestjs/common';
import { CreateDto, UpdateDto, RemoveDto } from './dto';
import { DataSource, QueryRunner } from 'typeorm';
import { EventsActionType } from './events.constant';
import { PlacesRepository } from 'src/places';
import { Photo, PhotosRepository } from 'src/photos';
import { ReviewsRepository, Review } from 'src/reviews';
import { PointLogsRepository } from 'src/point-logs';
import { UsersRepository } from 'src/users';

@Injectable()
export class ReviewEventsService {
    constructor(
        private readonly usersRepository:       UsersRepository,
        private readonly placesRepository:      PlacesRepository,
        private readonly photosRepository:      PhotosRepository,
        private readonly reviewsRepository:     ReviewsRepository,
        private readonly pointLogRepository:    PointLogsRepository,
        private dataSource: DataSource,
    ) {}

    private async startTransaction(): Promise<QueryRunner> {
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        return queryRunner;
    }

    async create(dto: CreateDto) {
        // Gen review obj
        const review = new Review();
        review.id = dto.reviewId;
        review.content = dto.content;
        review.author = await this.usersRepository.safelyFindOneById(dto.userId);
        review.place = await this.placesRepository.safelyFindOneById(dto.placeId);

        // Calc point
        let commitPoint = 0;
        commitPoint += dto.content.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        // Start transaction
        const queryRunner = await this.startTransaction();
        try {
            // Insert review
            await queryRunner.manager
                .withRepository(this.reviewsRepository)
                .safelySave(review);

            // Insert photos
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .safelySave(dto.attachedPhotoIds.map(photoId => {
                    const photo = new Photo();
                    photo.id = photoId;
                    photo.attachedReview = review;
                    return photo;
                }));

            // Update place
            const updateResult = await queryRunner.manager
                .withRepository(this.placesRepository)
                .updateFirstReview(dto.placeId, review);
            commitPoint += updateResult.affected > 0 ? 1 : 0;

            // Insert point log
            await queryRunner.manager
                .withRepository(this.pointLogRepository)
                .saveOne(review.author, EventsActionType.ADD, commitPoint);

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // Re-throw error to be able to catch in controller layer
            throw err;
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    async update(dto: UpdateDto) {
        // Load review
        const review = await this.reviewsRepository.safelyFindOneById({
            id: dto.reviewId,
            userId: dto.userId,
            placeId: dto.placeId,
            relations: ['author', 'photos'],
        });

        // Calc rollback & commit point
        let rollbackPoint = review.content.length > 0 ? 1 : 0;
        let commitPoint = dto.content.length > 0 ? 1 : 0;
        rollbackPoint += review.photos.length > 0 ? 1 : 0;
        commitPoint += dto.attachedPhotoIds.length > 0 ? 1 : 0;

        // Get toDelete, toInsert photos list
        const newPhotosSet = new Set(dto.attachedPhotoIds);
        const oldPhotosSet = new Set(review.photos.map(photo => photo.id));

        const toDelete = review.photos.filter(photo => !newPhotosSet.has(photo.id));
        const toInsert = dto.attachedPhotoIds.filter(photoId => !oldPhotosSet.has(photoId));

        // Start transaction
        const queryRunner = await this.startTransaction();
        try {
            // Update content
            await queryRunner.manager
                .withRepository(this.reviewsRepository)
                .updateContent(dto.reviewId, dto.content);

            // Soft delete unattached photos
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .softDeleteMany(toDelete);

            // Insert photos
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .safelySave(toInsert.map(photoId => {
                    const photo = new Photo();
                    photo.id = photoId;
                    photo.attachedReview = review;
                    return photo;
                }));

            // Insert point log
            await queryRunner.manager
                .withRepository(this.pointLogRepository)
                .saveOne(review.author, EventsActionType.MOD, commitPoint - rollbackPoint);

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // Re-throw error to be able to catch in controller layer
            throw err;
        } finally {
            // Defer
            await queryRunner.release();
        }
    }

    async remove(dto: RemoveDto) {
        // Get requested review
        const review = await this.reviewsRepository.safelyFindOneById({
            id: dto.reviewId,
            userId: dto.userId,
            placeId: dto.placeId,
            relations: ['author', 'photos', 'place']
        });

        // Calc rollback point
        let rollbackPoint = 0;
        rollbackPoint += review.content.length > 0 ? 1 : 0;
        rollbackPoint += review.photos.length > 0 ? 1 : 0;

        // Start transaction
        const queryRunner = await this.startTransaction();
        try {
            // Soft delete review
            await queryRunner.manager
                .withRepository(this.reviewsRepository)
                .softDeleteMany([ review ]);

            // Manual ON_DELETE_CASCADE for soft deleting a review
            await queryRunner.manager
                .withRepository(this.photosRepository)
                .softCascade(review);

            // Manual ON_DELETE_SET_NULL for soft deleting a review
            const updateResult = await queryRunner.manager
                .withRepository(this.placesRepository)
                .deleteFirstReview(review.place.id, review);
            rollbackPoint += updateResult.affected > 0 ? 1 : 0;

            // Insert point log
            await queryRunner.manager
                .withRepository(this.pointLogRepository)
                .saveOne(review.author, EventsActionType.DEL, -rollbackPoint);

            // Commit transaction
            await queryRunner.commitTransaction();
        } catch (err) {
            // Rollback for DB fault
            await queryRunner.rollbackTransaction();
            // Re-throw error to be able to catch in controller layer
            throw err;
        } finally {
            // Defer
            await queryRunner.release();
        }
    }
}
