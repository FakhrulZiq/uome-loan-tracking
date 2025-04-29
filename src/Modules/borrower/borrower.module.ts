import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/applications/constant';
import { BorrowerModel } from 'src/infrastructure/dataAccess/models/borrower.entity';
import { InstalmentScheduleModel } from 'src/infrastructure/dataAccess/models/instalmentSchedule.entity';
import { LoanModel } from 'src/infrastructure/dataAccess/models/loan.entity';
import { BorrowerRepository } from 'src/infrastructure/dataAccess/repositories/borrower.repository';
import { InstalmentScheduleRepository } from 'src/infrastructure/dataAccess/repositories/instalmentSchedule.repository';
import { LoanRepository } from 'src/infrastructure/dataAccess/repositories/loan.repository';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { InstalmentScheduleMapper } from '../InstalmentSchedule/InstalmentSchedule.mapper';
import { InstalmentScheduleService } from '../instalmentSchedule/instalmentSchedule.service';
import { LoanMapper } from '../Loan/Loan.mapper';
import { LoanService } from '../loan/loan.service';
import { PaymentMapper } from '../payment/payment.mapper';
import { BorrowerMapper } from './borrower.mapper';
import { BorrowerResolver } from './borrower.resolver';
import { BorrowerService } from './borrower.service';
import { UserService } from '../user/user.service';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { UserMapper } from '../user/user.mapper';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BorrowerModel,
      LoanModel,
      InstalmentScheduleModel,
      UserModel,
    ]),
  ],
  providers: [
    {
      provide: TYPES.IBorrowerService,
      useClass: BorrowerService,
    },
    {
      provide: TYPES.ILoanService,
      useClass: LoanService,
    },
    {
      provide: TYPES.IInstalmentScheduleService,
      useClass: InstalmentScheduleService,
    },
    {
      provide: TYPES.IUserService,
      useClass: UserService,
    },
    {
      provide: TYPES.IBorrowerRepository,
      useClass: BorrowerRepository,
    },
    {
      provide: TYPES.IInstalmentScheduleRepository,
      useClass: InstalmentScheduleRepository,
    },
    {
      provide: TYPES.ILoanRepository,
      useClass: LoanRepository,
    },
    {
      provide: TYPES.IUserRepository,
      useClass: UserRepository,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    BorrowerMapper,
    InstalmentScheduleMapper,
    LoanMapper,
    BorrowerResolver,
    PaymentMapper,
    FirebaseAdminService,
    UserMapper,
  ],
})
export class BorrowerModule {}
