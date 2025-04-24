import { Inject, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { TYPES } from 'src/applications/constant';
import {
  IAuthService,
  ILogOutResponse,
  INewAccessToken,
  INewAccessTokenInput,
  IPayloadJwt,
  IValidateUserInput,
  IValidateUserResponse,
} from 'src/applications/interfaces/authService.interface';
import { IUserRepository } from 'src/applications/interfaces/userRepository.interface';
import { IUserService } from 'src/applications/interfaces/userService.interface';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { applicationError } from 'src/utilities/exceptionInstance';
import { User } from '../user/user';

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    private readonly _configService: ConfigService,
    private readonly _jwtService: JwtService,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {}

  async validateUser(
    input: IValidateUserInput,
  ): Promise<IValidateUserResponse> {
    try {
      const { phoneNumber, password } = input;
      const user: User = await this._userService.findByPhoneNumber(phoneNumber);

      if (!user) {
        throw new UnauthorizedException('User not found');
      }

      const passwordValid = await bcrypt.compare(password, user.password);
      if (!passwordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = { phoneNumber: user.phoneNumber, sub: user.id };

      const accessToken = this._jwtService.sign(payload, {
        expiresIn: '30m',
      });

      const refreshToken = this._jwtService.sign(payload, {
        expiresIn: '1d',
        secret: process.env.JWT_REFRESH_SECRET,
      });

      const hashedRefreshToken = await bcrypt.hash(refreshToken, 10);
      user.refreshToken = hashedRefreshToken;
      await this._userRepository.save(user);

      return {
        accessToken,
        refreshToken,
        phoneNumber: user.phoneNumber,
        role: user.role,
      };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async assignNewAcessToken(
    input: INewAccessTokenInput,
  ): Promise<INewAccessToken> {
    try {
      const today: number = Date.now();
      const payload: IPayloadJwt = this._jwtService.verify(input.refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this._userService.findById(payload.sub);

      if (!user) {
        throw applicationError('User not found');
      }

      if (today > payload.exp * 1000) {
        await this._userService.clearRefreshToken(user.id);

        throw applicationError(
          'Your session has expired. Please log in again.',
        );
      }

      const newAccessToken = this._jwtService.sign({ sub: user.id });
      return { accessToken: newAccessToken };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async logout(input: INewAccessTokenInput): Promise<ILogOutResponse> {
    try {
      const payload: IPayloadJwt = this._jwtService.verify(input.refreshToken, {
        secret: this._configService.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this._userService.findById(payload.sub);

      if (!user) {
        throw applicationError('User not found');
      }

      user.refreshToken = null;
      await this._userRepository.save(user);

      return { message: 'User log out successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }
}
