import { Review } from 'src/events/entities';
import { DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('photoData')
export class Photo {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => Review, review => review.photos, { onDelete: 'CASCADE' })
    attachedReview: Review;

    @DeleteDateColumn()
    deletedAt: Date|null;
}
