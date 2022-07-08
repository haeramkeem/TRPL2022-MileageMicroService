import { Review } from 'src/reviews';
import { DeleteDateColumn, Entity, ManyToOne, PrimaryColumn } from 'typeorm';

@Entity('photoData')
export class Photo {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => Review, review => review.photos, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false,
    })
    attachedReview: Review;

    @DeleteDateColumn()
    deletedAt: Date|null;
}
