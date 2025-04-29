import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { IUserRepository } from 'src/applications/interfaces/userRepository.interface';
import { User } from 'src/Modules/user/user';
import { Repository } from 'typeorm';
import { UserModel } from '../models/user.entity';
import { GenericSqlRepository } from './generic.repository';
import { UserMapper } from 'src/modules/user/user.mapper';

@Injectable()
export class UserRepository
  extends GenericSqlRepository<User, UserModel>
  implements IUserRepository
{
  constructor(
    @InjectRepository(UserModel)
    repository: Repository<UserModel>,
  ) {
    const userMapper = new UserMapper();
    super(repository, userMapper);
  }
}
