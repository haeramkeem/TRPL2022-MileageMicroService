import { Review } from './index';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('userData')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @OneToMany(() => Review, review => review.author)
    reviews: Review[];
}
