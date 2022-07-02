import { Injectable } from '@nestjs/common';
import { UpdatePlaceDto } from './dto/update-place.dto';

@Injectable()
export class PlacesService {
    update(id: number, updatePlaceDto: UpdatePlaceDto) {
        return `This action updates a #${id} place`;
    }
}
