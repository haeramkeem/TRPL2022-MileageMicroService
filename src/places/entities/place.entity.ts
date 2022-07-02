import { Review } from 'src/reviews/entities/review.entity';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('placeData')
export class Place {
    @PrimaryColumn()
    id: string;

    @OneToOne(() => Review, { onDelete: "SET NULL" })
    @JoinColumn()
    firstReview: Review;

    @OneToMany(() => Review, review => review.place)
    reviews: Review[];
}
