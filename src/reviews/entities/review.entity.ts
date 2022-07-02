import { Place } from 'src/places/entities/place.entity';
import { User } from 'src/users/entities/user.entity';
import { Column, Entity, ManyToOne, PrimaryColumn, Unique } from 'typeorm';

@Entity('reviewData')
@Unique(['author', 'place'])
export class Review {
    @PrimaryColumn()
    id: string;

    @ManyToOne(() => User, user => user.reviews, { onDelete: "CASCADE" })
    author: User;

    @ManyToOne(() => Place, place => place.reviews, { onDelete: "CASCADE" })
    place: Place;

    @Column()
    content: string;
}
