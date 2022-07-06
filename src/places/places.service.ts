import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Place } from './entities/place.entity';

@Injectable()
export class PlacesService {
    constructor(
        @InjectRepository(Place) private placesRepository: Repository<Place>,
    ) {}

    async findOne(id: string): Promise<Place> {
        // TODO: place not found
        return await this.placesRepository.findOneBy({ id });
    }
}
