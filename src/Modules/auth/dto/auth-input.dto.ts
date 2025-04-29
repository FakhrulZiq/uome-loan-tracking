import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class LoginInput {
  @Field()
  phoneNumber: string;

  @Field()
  password: string;
}

@InputType()
export class RefreshTokenInput {
  @Field()
  refreshToken: string;
}

@InputType()
export class VerifyOtpInput {
  @Field()
  idToken: string;
}

@InputType()
export class GenerateFakeOtpIdTokenInput {
  @Field()
  phoneNumber: string;
}
