import { Inject, Injectable } from '@nestjs/common';
import {
  AUDIT_BY_SYSTEM,
  CRUD_ACTION,
  INSTALMENT_STATUS,
  TYPES,
} from 'src/applications/constant';
import { IAudit } from 'src/applications/interfaces/audit.interface';
import { IBorrowerRepository } from 'src/applications/interfaces/borrowerRepository.interface';
import {
  IAddBorrowerInput,
  IBorrowerInstalment,
  IBorrowerList,
  IBorrowerService,
  ICalculatedLoanDetails,
  INewBorrowerResponse,
  ITrackUserLoan,
} from 'src/applications/interfaces/borrowerService.interface';
import { IInstalmentScheduleRepository } from 'src/applications/interfaces/instalmentScheduleRepository.interface';
import { IInstalmentScheduleService } from 'src/applications/interfaces/instalmentScheduleService.interface';
import { ILoanRepository } from 'src/applications/interfaces/loanRepository.interface';
import { ILoanService } from 'src/applications/interfaces/loanService.interface';
import { Audit } from 'src/domain/audit/audit';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { applicationError } from 'src/utilities/exceptionInstance';
import { InstalmentSchedule } from '../InstalmentSchedule/InstalmentSchedule';
import { Loan } from '../Loan/Loan';
import { Borrower } from './borrower';
import { BorrowerParser } from './borrower.parser';
import { IUserService } from 'src/applications/interfaces/userService.interface';

@Injectable()
export class BorrowerService implements IBorrowerService {
  constructor(
    @Inject(TYPES.IBorrowerRepository)
    private readonly _borrowerRepository: IBorrowerRepository,
    @Inject(TYPES.IInstalmentScheduleRepository)
    private readonly _instalmentScheduleRepository: IInstalmentScheduleRepository,
    @Inject(TYPES.ILoanRepository)
    private readonly _loanRepository: ILoanRepository,
    @Inject(TYPES.IInstalmentScheduleService)
    private readonly _instalmentScheduleService: IInstalmentScheduleService,
    @Inject(TYPES.ILoanService)
    private readonly _loanService: ILoanService,
    @Inject(TYPES.IUserService)
    private readonly _userService: IUserService,
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
  ) {}

  async getBorrwerList(): Promise<IBorrowerList[]> {
    try {
      const borrower: Borrower[] =
        await this._borrowerRepository.getAllBorrowerList();

      return BorrowerParser.borrowerList(borrower);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async addNewBorrower(
    input: IAddBorrowerInput,
  ): Promise<INewBorrowerResponse> {
    try {
      const {
        name,
        phoneNumber,
        loanAmount,
        totalInstalments,
        remark,
        proofLink,
      } = input;

      let borrower: Borrower | null =
        await this._borrowerRepository.getBorrowerLoanDetails(phoneNumber);

      if (!borrower) {
        const auditProps: IAudit = Audit.createAuditProperties(
          input.name,
          CRUD_ACTION.create,
        );
        const audit: Audit = Audit.create(auditProps).getValue();

        const savedBorrower = Borrower.create({
          name,
          phoneNumber,
          audit,
        }).getValue();

        borrower = await this._borrowerRepository.save(savedBorrower);

        if (!borrower) {
          throw applicationError(
            `Unable to create user profile with properties ${JSON.stringify(
              input,
            )}`,
          );
        }
      }
      const borrowerId = borrower.id;

      const loanId = await this._loanService.addLoanDetail(
        loanAmount,
        totalInstalments,
        borrowerId,
        remark,
        proofLink,
      );

      await this._instalmentScheduleService.addInstalmentSchedule(
        loanAmount,
        totalInstalments,
        loanId,
        borrower.name,
      );

      await this._userService.registerUserBorrower(
        borrower.phoneNumber,
        borrower.phoneNumber,
        borrowerId,
      );

      const newBorrower = BorrowerParser.newBorrower(borrower);

      return newBorrower;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async trackUserLoan(phoneNumber: string): Promise<ITrackUserLoan> {
    try {
      const borrower: Borrower =
        await this._borrowerRepository.getBorrowerLoanDetails(phoneNumber);

      if (!borrower) {
        throw applicationError('Borrower not found');
      }

      for (const loan of borrower.loans) {
        await this._changeNotPaidInstalmentStatus(loan);
      }

      const loan: ICalculatedLoanDetails = this._calculateLoanDetails(
        borrower.loans,
      );
      const userLoan: ITrackUserLoan = BorrowerParser.userLoanParser(loan);

      return userLoan;
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  private _calculateLoanDetails(loans: Loan[]): ICalculatedLoanDetails {
    const currentDate = new Date();

    const totalPaymentsMade: string = this._calculateTotalPayments(loans);
    const pastInstalments: InstalmentSchedule[] = this._filterPastInstalments(
      loans,
      currentDate,
    );
    const totalPastInstalment: string =
      this._calculateTotalPastIntalment(pastInstalments);
    const carryOverAmount: number =
      Number(totalPaymentsMade) - Number(totalPastInstalment);

    const loanAmount: string = this._calculateTotalLoan(loans);

    const outstandingAmount: string = this._calculateOutstandingLoan(loans);

    const currentMonthDue = this._calculateCurrentMonthDue(loans);

    const instalments: InstalmentSchedule[] = loans.flatMap(
      (instalment) => instalment.instalmentSchedules,
    );

    return {
      loanAmount,
      outstandingAmount,
      currentMonthDue,
      carryOverAmount,
      instalments,
    };
  }

  private _calculateTotalPayments(loans: Loan[]): string {
    const { paid } = INSTALMENT_STATUS;

    const amountPaid: number = loans
      .flatMap((loan) => loan.instalmentSchedules)
      .filter((instalment) => instalment.status === paid)
      .reduce((sum, instalment) => sum + Number(instalment.amountDue), 0);

    return amountPaid.toFixed(2);
  }

  private _calculateOutstandingLoan(loans: Loan[]): string {
    const { pending, unpaid } = INSTALMENT_STATUS;

    const amountPending: number = loans
      .flatMap((loan) => loan.instalmentSchedules)
      .filter((instalment) => instalment.status === pending)
      .reduce((sum, instalment) => sum + Number(instalment.amountDue), 0);

    const amountUnpaid: number = loans
      .flatMap((loan) => loan.instalmentSchedules)
      .filter((instalment) => instalment.status === unpaid)
      .reduce((sum, instalment) => sum + Number(instalment.amountDue), 0);

    return (amountPending + amountUnpaid).toFixed(2);
  }

  private _calculateTotalLoan(loans: Loan[]): string {
    const totalLoan: number = loans
      .flatMap((loan) => loan.instalmentSchedules)
      .reduce((sum, instalment) => sum + Number(instalment.amountDue), 0);

    return totalLoan.toFixed(2);
  }

  private _filterPastInstalments(loans: Loan[], currentDate: Date) {
    return loans
      .flatMap((loan) => loan.instalmentSchedules)
      .filter(
        (schedule: InstalmentSchedule) =>
          new Date(schedule.dueDate) < currentDate,
      );
  }

  private _calculateTotalPastIntalment(
    instalments: InstalmentSchedule[],
  ): string {
    const data = instalments
      .flatMap((schedule) => schedule)
      .reduce((sum, schedule) => sum + Number(schedule.amountDue), 0);

    return data.toFixed(2);
  }

  private _calculateCurrentMonthDue(loans: Loan[]) {
    const currentMonthDue = loans
      .flatMap((loan) => loan.instalmentSchedules)
      .filter(
        (schedule: InstalmentSchedule) =>
          schedule.status === INSTALMENT_STATUS.pending,
      )
      .reduce(
        (sum: number, schedule: InstalmentSchedule) =>
          sum + Number(schedule.amountDue),
        0,
      );
    return currentMonthDue.toFixed(2);
  }

  private async _changeNotPaidInstalmentStatus(loan: Loan): Promise<void> {
    try {
      const today = new Date();
      const { pending, paid, unpaid } = INSTALMENT_STATUS;
      const auditProps: IAudit = Audit.createAuditProperties(
        AUDIT_BY_SYSTEM,
        CRUD_ACTION.update,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      for (const instalment of loan.instalmentSchedules) {
        const dueDate = new Date(instalment.dueDate);
        const status = instalment.status;
        let instalmentUpdate = instalment;

        const previousDueDate = new Date(dueDate);
        previousDueDate.setMonth(dueDate.getMonth() - 1);

        if (today >= previousDueDate && today < dueDate && status !== paid) {
          instalmentUpdate = InstalmentSchedule.update(
            { status: pending },
            instalment,
            audit,
          );
        } else if (today >= dueDate && status !== paid) {
          instalmentUpdate = InstalmentSchedule.update(
            { status: unpaid },
            instalment,
            audit,
          );
        }
        await this._instalmentScheduleRepository.save(instalmentUpdate);
      }
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async getBorrowerByInstalmentScheduleId(
    instalmentId: string,
  ): Promise<IBorrowerInstalment> {
    try {
      const instalment: InstalmentSchedule =
        await this._instalmentScheduleRepository.findOne({
          where: { id: instalmentId },
        });

      if (instalment.status === INSTALMENT_STATUS.paid) {
        throw applicationError('This instalment has been paid');
      }

      const loan: Loan = await this._loanRepository.findOne({
        where: { id: instalment.loanId },
      });

      const borrower: Borrower = await this._borrowerRepository.findOne({
        where: { id: loan.borrowerId },
      });

      return BorrowerParser.borrowerInstalment(instalment, loan, borrower);
    } catch (error) {
      this._logger.error(error.errorMessage || error.message, error);
      throw error;
    }
  }
}
