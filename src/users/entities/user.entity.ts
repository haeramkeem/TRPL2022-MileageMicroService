import { PointLog } from 'src/point-logs';
import { Review } from 'src/reviews';
import { Entity, OneToMany, PrimaryColumn } from 'typeorm';

@Entity('userData')
export class User {
    @PrimaryColumn('uuid')
    id: string;

    @OneToMany(() => Review, review => review.author)
    reviews: Review[];

    @OneToMany(() => PointLog, pointLog => pointLog.owner)
    pointLogs: PointLog[];
}
