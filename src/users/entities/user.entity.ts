import { Review } from 'src/reviews/entities/review.entity';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('userData')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @OneToMany(() => Review, review => review.author)
    reviews: Review[];
}
