import { Field, ObjectType } from '@nestjs/graphql';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { BaseModel } from './base.entity';
import { BorrowerModel } from './borrower.entity';

@Entity({ name: 'user' })
@ObjectType()
export class UserModel extends BaseModel {
  @Column({ type: 'varchar', length: 100, unique: true })
  phoneNumber: string;

  @Column()
  password: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  role: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  refreshToken?: string;

  @Field(() => BorrowerModel, { nullable: true })
  @OneToOne(() => BorrowerModel, { nullable: true, cascade: true })
  @JoinColumn()
  borrowerProfile?: BorrowerModel;
}
