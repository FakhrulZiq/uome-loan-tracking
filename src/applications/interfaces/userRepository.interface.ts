import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { User } from 'src/Modules/user/user';
import { IGenericRepository } from './genricRepository.interface';

export interface IUserRepository extends IGenericRepository<User, UserModel> {}
