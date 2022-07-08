import { User } from 'src/users';
import { Place } from 'src/places';
import { Photo } from 'src/photos';
import { Column, DeleteDateColumn, Entity, ManyToOne, OneToMany, PrimaryColumn, Unique } from 'typeorm';

@Entity('reviewData')
@Unique('UQ_AUTHOR_PLACE', ['author', 'place'])
export class Review {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => User, user => user.reviews, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false,
    })
    author: User;

    @ManyToOne(() => Place, place => place.reviews, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false,
    })
    place: Place;

    @OneToMany(() => Photo, photo => photo.attachedReview)
    photos: Photo[];

    @Column()
    content: string;

    @DeleteDateColumn()
    deletedAt: Date|null;
}
