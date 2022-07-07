import { IsNull, Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Place } from './entities/place.entity';
import { PlaceInvalidError } from './places.error';
import { Review } from 'src/reviews';

@CustomRepository(Place)
export class PlacesRepository extends Repository<Place> {
    async safelyFindOneById(id: string): Promise<Place> {
        const place = await this.findOneBy({ id });
        if (!place) throw new PlaceInvalidError();
        return place;
    }

    async updateFirstReview(id: string, firstReview: Review) {
        return await this.update({
            id,
            firstReview: IsNull(),
        }, {
            firstReview,
        });
    }

    async deleteFirstReview(id: string, firstReview: Review) {
        return await this.update({
            id,
            firstReview,
        }, {
            firstReview: null,
        });
    }
}
