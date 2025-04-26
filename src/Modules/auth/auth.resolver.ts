import { Inject, UseGuards } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TYPES } from 'src/applications/constant';
import {
  IAuthService,
  ILogOutResponse,
  INewAccessToken,
} from 'src/applications/interfaces/authService.interface';
import { GqlAuthGuard } from './auth.guard';
import {
  AuthResponse,
  LogOutResponse,
  NewAccessTokenDto,
} from './dto/auth-response.dto';
import { LoginInput, RefreshTokenInput } from './dto/login-input.dto';

@Resolver()
export class AuthResolver {
  constructor(
    @Inject(TYPES.IAuthService)
    private readonly _authService: IAuthService,
  ) {}

  @Mutation(() => AuthResponse)
  async login(@Args('loginInput') loginInput: LoginInput) {
    return this._authService.validateUser(loginInput);
  }

  @Mutation(() => NewAccessTokenDto)
  async refreshToken(
    @Args('refreshTokenInput') refreshTokenInput: RefreshTokenInput,
  ): Promise<INewAccessToken> {
    return this._authService.assignNewAcessToken(refreshTokenInput);
  }

  @Mutation(() => LogOutResponse)
  @UseGuards(GqlAuthGuard)
  async logout(
    @Args('logOutInput') logoutInput: RefreshTokenInput,
  ): Promise<ILogOutResponse> {
    return this._authService.logout(logoutInput);
  }
}
