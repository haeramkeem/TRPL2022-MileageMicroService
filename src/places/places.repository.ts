import { IsNull, Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Place } from './entities/place.entity';

@CustomRepository(Place)
export class PlacesRepository extends Repository<Place> {
    async updateFirstReview(id:string, firstReviewId: string) {
        return await this.update({
            id,
            firstReview: IsNull(),
        }, {
            firstReview: { id: firstReviewId },
        });
    }

    async softDeleteOne(reviewId: string) {
        return await this.update({
            firstReview: { id: reviewId },
        }, {
            firstReview: null,
        });
    }
}
