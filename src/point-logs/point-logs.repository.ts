import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { PointLog } from './entities/point-log.entity';
import { User } from 'src/users';
import { ActionType } from 'src/common/constants';

@CustomRepository(PointLog)
export class PointLogsRepository extends Repository<PointLog> {
    async saveOne(owner: User, action: ActionType, diff: number) {
        if (diff === 0) return;

        const pointLog = new PointLog();
        pointLog.owner = owner;
        pointLog.action = action;
        pointLog.point = (await this.safelyFindPointByOwnerId(owner.id)) + diff;

        await this.save(pointLog);
    }

    async safelyFindPointByOwnerId(ownerId: string): Promise<number> {
        const latest = await this.findOne({
            where: { owner: { id: ownerId } },
            order: { id: 'DESC' },
        });

        if (!latest) return 0;

        return latest.point;
    }
}
