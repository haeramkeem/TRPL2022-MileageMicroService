import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Review } from './entities/review.entity';
import { AddDuplicatedReviewError, ReviewInvalidError } from './reviews.error';
import { FindOneDto } from './dto/findOne.dto';

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
                    throw err; // Re-throw
                }
            });
    }

    async safelyFindOneById(dto: FindOneDto): Promise<Review> {
        const review = await this.findOne({
            where: { id: dto.id },
            relations: dto.relations,
        });
        if (!review) throw new ReviewInvalidError();
        return review;
    }

    async updateContent(id: string, content: string) {
        return await this.update({ id }, { content });
    }
}
