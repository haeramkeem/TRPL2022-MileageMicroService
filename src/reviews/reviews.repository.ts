import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Review } from './entities/review.entity';
import { UnhandledError } from 'src/common/errors';
import { AddDuplicatedReviewError, ReviewInvalidError } from './reviews.error';

@CustomRepository(Review)
export class ReviewsRepository extends Repository<Review> {
    async safelySave(review: Review|Review[]) {
        return await this
            .createQueryBuilder()
            .insert()
            .into(Review)
            .values(review)
            .execute()
            .catch(err => {
                if (err.code === 'ER_DUP_ENTRY') {
                    throw new AddDuplicatedReviewError();
                } else {
                    throw new UnhandledError(err);
                }
            });
    }

    async safelyFindOneById(id: string, relations: string[]): Promise<Review> {
        const review = await this.findOne({ where: { id }, relations });
        if (!review) throw new ReviewInvalidError();
        return review;
    }

    async updateContent(id: string, content: string) {
        return await this.update({ id }, { content });
    }
}
