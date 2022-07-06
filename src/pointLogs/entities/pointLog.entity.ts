import { User } from 'src/users';
import { ActionType } from 'src/constants';
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity('pointLogData')
export class PointLog {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User, user => user.pointLogs, { onDelete: "CASCADE" })
    owner: User;

    @CreateDateColumn()
    timestamp: Date;

    @Column({ type: 'enum', enum: ActionType })
    action: ActionType;

    @Column()
    point: number;
}
