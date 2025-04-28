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
  GenerateFakeOtpIdTokenInput,
  LoginInput,
  RefreshTokenInput,
  VerifyOtpInput,
} from './dto/auth-input.dto';
import {
  AuthResponse,
  FakeOtpIdTokenOutput,
  LogOutResponse,
  NewAccessTokenDto,
  VerifyOtpOutput,
} from './dto/auth-response.dto';

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

  @Mutation(() => VerifyOtpOutput)
  async verifyOtp(
    @Args('input') input: VerifyOtpInput,
  ): Promise<VerifyOtpOutput> {
    return this._authService.otpVerification(input);
  }

  @Mutation(() => FakeOtpIdTokenOutput)
  async generateFakeOtpIdToken(
    @Args('generateFakeIdToken') input: GenerateFakeOtpIdTokenInput,
  ): Promise<FakeOtpIdTokenOutput> {
    return this._authService.generateIdToken(input.phoneNumber);
  }
}
