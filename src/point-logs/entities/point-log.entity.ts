import { User } from 'src/users';
import { ActionType } from 'src/common/constants';
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

    @Column({ type: 'enum', enum: ActionType })
    action: ActionType;

    @Column({ nullable: false })
    point: number;
}
