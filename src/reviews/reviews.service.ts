import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlacesService } from 'src/places/places.service';
import { UsersService } from 'src/users/users.service';
import { Repository } from 'typeorm';
import { Review } from './entities/review.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewsService {
    constructor(
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
        private usersService: UsersService,
        private placesService: PlacesService,
    ) {}

    async getOne(id: string): Promise<Review> {
        return this.reviewRepository.findOne({ where: { id } });
    }

    async create(validated: CreateReviewDto) {
        const { reviewId, authorId, placeId, content } = validated;
        const review = new Review();
        review.id = reviewId;
        review.content = content;
        review.author = await this.usersService.getOne(authorId); // TODO: NotFoundException for author
        review.place = await this.placesService.getOne(placeId); // TODO: NotFoundException for place
        return await this.reviewRepository.save(review);
    }
}
