import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/applications/constant';
import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { UserService } from './user.service';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import { UserMapper } from './user.mapper';
import { UserResolver } from './user.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([UserModel])],
  providers: [
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    UserMapper,
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    UserResolver,
  ],
})
export class UserModule {}
