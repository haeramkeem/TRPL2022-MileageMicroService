import { User } from 'src/users';
import { EventsActionType } from 'src/events/events.constant';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pointLogData')
export class PointLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.pointLogs, {
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE',
        nullable: false,
    })
    owner: User;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'enum', enum: EventsActionType })
    action: EventsActionType;

    @Column({ nullable: false })
    point: number;
}
