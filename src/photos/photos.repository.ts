import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Photo } from './entities/photo.entity';
import { Review } from 'src/reviews/entities/review.entity';
import { AddDuplicatedPhotoError } from './photos.error';
import { UnhandledError } from 'src/common/errors';

@CustomRepository(Photo)
export class PhotosRepository extends Repository<Photo> {
    async safelySave(photo: Photo|Photo[]) {
        return await this
            .createQueryBuilder()
            .insert()
            .into(Photo)
            .values(photo)
            .execute()
            .catch(err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new AddDuplicatedPhotoError();
                } else {
                    throw new UnhandledError(err);
                }
            });
    }

    async softDeleteMany(photos: Photo[]) {
        photos.forEach(async (photo) => {
            await this.softDelete({ id: photo.id });
        })
    }

    async softCascade(attachedReview: Review) {
        await this.softDelete({ attachedReview });
    }
}
