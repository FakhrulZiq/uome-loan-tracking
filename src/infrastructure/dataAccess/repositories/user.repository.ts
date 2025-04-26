import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TYPES } from 'src/applications/constant';
import { IContextAwareLogger } from 'src/infrastructure/logger';

import { Repository } from 'typeorm';
import { GenericSqlRepository } from './generic.repository';
import { User } from 'src/Modules/user/user';
import { UserModel } from '../models/user.entity';
import { IUserRepository } from 'src/applications/interfaces/userRepository.interface';
import { UserMapper } from 'src/Modules/user/user.mapper';

@Injectable()
export class UserRepository
  extends GenericSqlRepository<User, UserModel>
  implements IUserRepository
{
  userMapper: UserMapper;
  constructor(
    @InjectRepository(UserModel)
    repository: Repository<UserModel>,
    userMapper: UserMapper,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {
    super(repository, userMapper);
    this.userMapper = userMapper;
  }
}
