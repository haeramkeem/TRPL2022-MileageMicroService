import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Review} from 'src/reviews/entities/review.entity';
import {Repository} from 'typeorm';
import {Place} from './entities/place.entity';

@Injectable()
export class PlacesService {
    constructor(
        @InjectRepository(Place) private placeRepository: Repository<Place>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
    ) {}

    async update(placeId: string, firstReviewId: string) {
        const firstReview = await this.reviewRepository.findOne({
            where: { id: firstReviewId },
        });

        // TODO: NotFoundException for firstReview
        // TODO: Update only when the firstReview is nil

        this.placeRepository.update({ id: placeId }, { firstReview });
        // TODO: NotFoundException for place
        // TODO: return the number of affected rows
    }
}
