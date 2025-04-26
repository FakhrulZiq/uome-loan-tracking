import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterUserInput {
  @Field()
  phoneNumber: string;

  @Field()
  password: string;

  @Field()
  role: string;
}
