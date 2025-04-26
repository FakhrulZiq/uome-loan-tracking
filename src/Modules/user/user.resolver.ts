import { Inject } from '@nestjs/common';
import { Args, Mutation, Resolver } from '@nestjs/graphql';
import { TYPES } from 'src/applications/constant';
import { IUserService } from 'src/applications/interfaces/userService.interface';
import { RegisterUserInput } from './dto/register-user.input';
import { RegisterUserResponseDto } from './dto/register-user.response';

@Resolver()
export class UserResolver {
  constructor(
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
  ) {}

  @Mutation(() => RegisterUserResponseDto)
  async registerUser(
    @Args('registerUserInput') input: RegisterUserInput,
  ): Promise<string> {
    return this._userService.register(input);
  }
}
