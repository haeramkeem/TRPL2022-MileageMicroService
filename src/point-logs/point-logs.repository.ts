import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { PointLog } from './entities/point-log.entity';
import { User } from 'src/users';
import { EventsActionType } from 'src/events/events.constant';
import { PointNotFoundError } from './point-logs.error';

@CustomRepository(PointLog)
export class PointLogsRepository extends Repository<PointLog> {
    async saveOne(owner: User, action: EventsActionType, diff: number) {
        if (diff === 0) return;

        const pointLog = new PointLog();
        pointLog.owner = owner;
        pointLog.action = action;
        pointLog.point = await this
            .safelyFindOneByOwnerId(owner.id)
            .then(pointLog => (pointLog.point + diff))
            .catch(err => {
                if (err instanceof PointNotFoundError) return diff;
                throw err; // Re-throw
            });

        await this.save(pointLog);
    }

    async safelyFindOneByOwnerId(ownerId: string): Promise<PointLog> {
        const latest = await this.findOne({
            where: { owner: { id: ownerId } },
            order: { id: 'DESC' },
        });

        if (!latest) throw new PointNotFoundError();

        return latest;
    }
}
