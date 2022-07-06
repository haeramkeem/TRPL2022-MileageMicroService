import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Photo } from './entities/photo.entity';
import { Review } from 'src/reviews/entities/review.entity';

@CustomRepository(Photo)
export class PhotosRepository extends Repository<Photo> {
    async saveMany(ids: string[], attachedReview: Review) {
        await this.save(ids.map(id => {
            const photo = new Photo();
            photo.id = id;
            photo.attachedReview = attachedReview;
            return photo;
        }));
    }

    async findWithAttachedReview(attachedReview: Review): Promise<Photo[]> {
        return await this.findBy({ attachedReview });
    }

    async softDeleteMany(photos: Photo[]) {
        photos.forEach(async (photo) => {
            await this.softDelete(photo);
        })
    }

    async softCascadeMany(attachedReview: Review) {
        await this.softDelete({ attachedReview });
    }
}
