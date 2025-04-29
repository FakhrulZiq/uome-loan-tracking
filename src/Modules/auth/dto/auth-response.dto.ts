import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class AuthResponse {
  @Field()
  accessToken: string;

  @Field()
  refreshToken: string;

  @Field()
  phoneNumber: string;

  @Field()
  role: string;
}

@ObjectType()
export class NewAccessTokenDto {
  @Field()
  accessToken: string;
}

@ObjectType()
export class LogOutResponse {
  @Field()
  message: string;
}

@ObjectType()
export class VerifyOtpOutput {
  @Field()
  uid: string;

  @Field({ nullable: true })
  phoneNumber?: string;
}

@ObjectType()
export class FakeOtpIdTokenOutput {
  @Field()
  idToken: string;
}
