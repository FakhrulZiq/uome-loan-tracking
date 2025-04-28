import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/applications/constant';
import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { UserMapper } from './user.mapper';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';

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
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    FirebaseAdminService,
    UserMapper,
    UserResolver,
  ],
})
export class UserModule {}
