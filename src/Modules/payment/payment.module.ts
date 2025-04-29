import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TYPES } from 'src/applications/constant';
import { BillplzService } from 'src/infrastructure/billplz/billplz.service';
import { BorrowerModel } from 'src/infrastructure/dataAccess/models/borrower.entity';
import { InstalmentScheduleModel } from 'src/infrastructure/dataAccess/models/instalmentSchedule.entity';
import { LoanModel } from 'src/infrastructure/dataAccess/models/loan.entity';
import { PaymentModel } from 'src/infrastructure/dataAccess/models/payment.entity';
import { BorrowerRepository } from 'src/infrastructure/dataAccess/repositories/borrower.repository';
import { InstalmentScheduleRepository } from 'src/infrastructure/dataAccess/repositories/instalmentSchedule.repository';
import { LoanRepository } from 'src/infrastructure/dataAccess/repositories/loan.repository';
import { PaymentRepository } from 'src/infrastructure/dataAccess/repositories/payment.repository';
import { ApplicationLogger } from 'src/infrastructure/logger';
import { BorrowerMapper } from '../borrower/borrower.mapper';
import { BorrowerService } from '../borrower/borrower.service';
import { InstalmentScheduleMapper } from '../InstalmentSchedule/InstalmentSchedule.mapper';
import { InstalmentScheduleService } from '../instalmentSchedule/instalmentSchedule.service';
import { LoanMapper } from '../Loan/Loan.mapper';
import { LoanService } from '../loan/loan.service';
import { PaymentController } from './payment.controller';
import { PaymentMapper } from './payment.mapper';
import { PaymentResolver } from './payment.resolver';
import { PaymentService } from './payment.service';
import { UserService } from '../user/user.service';
import { UserRepository } from 'src/infrastructure/dataAccess/repositories/user.repository';
import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      PaymentModel,
      BorrowerModel,
      InstalmentScheduleModel,
      LoanModel,
      UserModel,
    ]),
  ],
  providers: [
    {
      provide: TYPES.IPaymentService,
      useClass: PaymentService,
    },
    {
      provide: TYPES.IPaymentRepository,
      useClass: PaymentRepository,
    },
    {
      provide: TYPES.IBillplzService,
      useClass: BillplzService,
    },
    {
      provide: TYPES.IBorrowerService,
      useClass: BorrowerService,
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
    {
      provide: TYPES.IInstalmentScheduleService,
      useClass: InstalmentScheduleService,
    },
    {
      provide: TYPES.ILoanService,
      useClass: LoanService,
    },
    { provide: TYPES.IApplicationLogger, useClass: ApplicationLogger },
    PaymentResolver,
    PaymentMapper,
    BorrowerMapper,
    InstalmentScheduleMapper,
    LoanMapper,
    FirebaseAdminService,
  ],
  controllers: [PaymentController],
})
export class PaymentModule {}
