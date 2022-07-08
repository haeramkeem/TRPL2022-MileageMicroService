import { Review } from 'src/reviews';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('placeData')
export class Place {
    @PrimaryColumn('uuid')
    id: string;

    @OneToOne(() => Review, {
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
    })
    @JoinColumn()
    firstReview: Review;

    @OneToMany(() => Review, review => review.place)
    reviews: Review[];
}
