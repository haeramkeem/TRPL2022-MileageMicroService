import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Review } from './entities/review.entity';
import { User } from 'src/users/entities/user.entity';
import { Place } from 'src/places/entities/place.entity';

@CustomRepository(Review)
export class ReviewsRepository extends Repository<Review> {
    static getObj(id: string, content: string, author: User, place: Place) {
        const review = new Review();
        review.id = id;
        review.content = content;
        review.author = author;
        review.place = place;
        return review;
    }

    async findOneWithRelated(id: string, relations: string[]): Promise<Review> {
        return await this.findOne({
            where: { id },
            relations,
        })
    }

    async updateContent(id: string, content: string) {
        return await this.update({ id }, { content });
    }
}
