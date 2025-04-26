import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { join } from 'path';
import { DatabaseModule } from './infrastructure/dataAccess/database/database.module';
import { BorrowerModule } from './modules/borrower/borrower.module';
import { PaymentModule } from './modules/payment/payment.module';
import { UserModule } from './Modules/user/user.module';
import { AuthModule } from './Modules/auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), '/schema.gql'),
      context: ({ req }) => ({ req }),
    }),
    DatabaseModule,
    BorrowerModule,
    PaymentModule,
    UserModule,
    AuthModule,
  ],
})
export class AppModule {}
