import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthResolver } from './auth.resolver';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.stratergy';
import { TYPES } from 'src/applications/constant';
import { UserService } from '../user/user.service';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserMapper } from '../user/user.mapper';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserModel]),
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: { expiresIn: '30m' },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [
    {
      provide: TYPES.IAuthService,
      useClass: AuthService,
    },
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    UserMapper,
    JwtStrategy,
    AuthResolver,
  ],
})
export class AuthModule {}
