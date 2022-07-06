import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { PointLog } from './entities/pointLog.entity';
import { User } from 'src/users';
import { ActionType } from 'src/constants';

@CustomRepository(PointLog)
export class PointLogsRepository extends Repository<PointLog> {
    async saveOne(owner: User, action: ActionType, diff: number) {
        if (diff === 0) return;

        const latestPoint = (await this.findOne({
            where: { owner },
            order: { id: 'DESC' },
        }) || { point: 0 }).point;

        const pointLog = new PointLog();
        pointLog.owner = owner;
        pointLog.action = action;
        pointLog.point = latestPoint + diff;

        this.save(pointLog);
    }
}
