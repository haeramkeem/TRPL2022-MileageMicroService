import { Review } from 'src/events/entities';
import { Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';

@Entity('placeData')
export class Place {
    @PrimaryColumn('uuid')
    id: string;

    @OneToOne(() => Review, { onDelete: "SET NULL" })
    @JoinColumn()
    firstReview: Review;

    @OneToMany(() => Review, review => review.place)
    reviews: Review[];
}
