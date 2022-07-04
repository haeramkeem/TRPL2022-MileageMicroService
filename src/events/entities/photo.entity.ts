import { Review } from "./index";
import { Column, Entity, ManyToOne, PrimaryColumn } from "typeorm";

@Entity('photoData')
export class Photo {
    @PrimaryColumn('uuid')
    id: string;

    @ManyToOne(() => Review, review => review.photos, { onDelete: "CASCADE" })
    attachedReview: Review;

    @Column('boolean', { default: false })
    isDeleted: boolean = false;
}
