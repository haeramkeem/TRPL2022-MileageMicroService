import { Injectable } from '@nestjs/common';
import {InjectRepository} from '@nestjs/typeorm';
import {Review} from 'src/reviews/entities/review.entity';
import {Repository} from 'typeorm';
import {UpdatePlaceDto} from './dto/update-place.dto';
import {Place} from './entities/place.entity';

@Injectable()
export class PlacesService {
    constructor(
        @InjectRepository(Place) private placeRepository: Repository<Place>,
        @InjectRepository(Review) private reviewRepository: Repository<Review>,
    ) {}

    async update(validated: UpdatePlaceDto) {
        const id = validated.placeId;
        const place = await this.placeRepository.findOne({ where: { id } });
        if (!place) {
            console.error("PlaceNotFound")
            return; // TODO: NotFoundException for place
        }
        if (place.firstReview) {
            console.log(place.firstReview);
            return; // Abort: Update place only when firstReview is nil
        }

        const firstReview = await this.reviewRepository.findOne({ where: { id: validated.firstReviewId } });
        if (!firstReview) {
            console.error("ReviewNotFound")
            return; // TODO: NotFoundException for firstReview
        }

        await this.placeRepository.update({ id }, { firstReview });

        // TODO: return the number of affected rows or subscriber
    }
}
