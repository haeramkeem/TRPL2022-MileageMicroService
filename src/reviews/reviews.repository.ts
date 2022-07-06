import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { Review } from './entities/review.entity';

@CustomRepository(Review)
export class ReviewsRepository extends Repository<Review> {
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
