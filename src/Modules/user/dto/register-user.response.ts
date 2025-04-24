import { Field, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class RegisterUserResponseDto {
  @Field()
  message: string;
}
