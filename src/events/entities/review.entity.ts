import { User } from 'src/users/entities/user.entity';
import { Place } from 'src/places/entities/place.entity';
import { Photo } from 'src/photos/entities/photo.entity';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';

@Entity('reviewData')
@Unique(['author', 'place'])
export class Review {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.reviews, { onDelete: "CASCADE" })
    author: User;

    @ManyToOne(() => Place, place => place.reviews, { onDelete: "CASCADE" })
    place: Place;

    @OneToMany(() => Photo, photo => photo.attachedReview)
    photos: Photo[];

    @Column()
    content: string;

    @DeleteDateColumn()
    deletedAt: Date|null;
}
