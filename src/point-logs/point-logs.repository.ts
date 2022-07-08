import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { PointLog } from './entities/point-log.entity';
import { User } from 'src/users';
import { ActionType } from 'src/common/constants';

@CustomRepository(PointLog)
export class PointLogsRepository extends Repository<PointLog> {
    async saveOne(owner: User, action: ActionType, diff: number) {
        if (diff === 0) return;

        const latestPoint = await this.findOne({
            where: { owner },
            order: { id: 'DESC' },
        });

        const pointLog = new PointLog();
        pointLog.owner = owner;
        pointLog.action = action;
        pointLog.point = !!latestPoint ? latestPoint.point + diff : diff;

        await this.save(pointLog);
    }
}
