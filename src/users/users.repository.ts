import { Repository } from 'typeorm';
import { CustomRepository } from 'src/typeorm-ex/typeorm-ex.decorator';
import { User } from './entities/user.entity';
import { UserInvalidError } from './users.error';

@CustomRepository(User)
export class UsersRepository extends Repository<User> {
    async safelyFindOneById(id: string): Promise<User> {
        const user = await this.findOneBy({ id })
        if (!user) throw new UserInvalidError();
        return user;
    }
}
