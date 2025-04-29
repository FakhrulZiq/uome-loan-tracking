import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AUDIT_BY_SYSTEM, CRUD_ACTION, TYPES } from 'src/applications/constant';
import { IAudit } from 'src/applications/interfaces/audit.interface';
import { IUserRepository } from 'src/applications/interfaces/userRepository.interface';
import {
  IRegisterResponse,
  IResgisterInput,
  IUserService,
} from 'src/applications/interfaces/userService.interface';
import { Audit } from 'src/domain/audit/audit';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { applicationError } from 'src/utilities/exceptionInstance';
import { User } from './user';
import { FirebaseAdminService } from 'src/infrastructure/firebase/firebase-admin.service';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
    private readonly _firebaseAdminService: FirebaseAdminService,
  ) {}

  async findById(id: string): Promise<User> {
    try {
      return await this._userRepository.findOne({
        where: { id },
      });
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User> {
    try {
      return await this._userRepository.findOne({
        where: { phoneNumber },
      });
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async register(input: IResgisterInput): Promise<IRegisterResponse> {
    try {
      const { phoneNumber, password, role } = input;

      const existingUser: User = await this._userRepository.findOne({
        where: { phoneNumber },
      });

      if (existingUser) {
        throw new ConflictException('Phone number already registered');
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const auditProps: IAudit = Audit.createAuditProperties(
        input.phoneNumber,
        CRUD_ACTION.create,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const newUser = User.create({
        phoneNumber,
        password: hashedPassword,
        role,
        isVerified: false,
        audit,
      }).getValue();

      const savedUser = await this._userRepository.save(newUser);

      if (!savedUser) {
        throw applicationError(
          `Unable to create a new user with this ${phoneNumber} phone number`,
        );
      }

      await this._firebaseAdminService.registerUserInFirebase(
        savedUser.id,
        savedUser.phoneNumber,
      );

      return { message: 'User registration successfully' };
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async registerUserBorrower(
    phoneNumber: string,
    password: string,
    borrowerId: string,
  ): Promise<string> {
    try {
      const existingUser: User = await this._userRepository.findOne({
        where: { phoneNumber },
      });

      if (existingUser) {
        throw new ConflictException('Phone number already registered');
      }

      const hashedPassword: string = await bcrypt.hash(password, 10);

      const auditProps: IAudit = Audit.createAuditProperties(
        phoneNumber,
        CRUD_ACTION.create,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const newUser = User.create({
        phoneNumber,
        password: hashedPassword,
        role: 'BORROWER',
        borrowerId,
        isVerified: false,
        audit,
      }).getValue();

      const savedUser = await this._userRepository.save(newUser);

      if (!savedUser) {
        throw applicationError(
          `Unable to create a new user with this ${phoneNumber} phone number`,
        );
      }

      await this._firebaseAdminService.registerUserInFirebase(
        savedUser.id,
        savedUser.phoneNumber,
      );

      return 'User registration successfully';
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async clearRefreshToken(id: string): Promise<void> {
    try {
      const user: User = await this._userRepository.findOne({
        where: { id },
      });
      if (!user) {
        throw applicationError('User not found');
      }

      user.refreshToken = null;
      await this._userRepository.save(user);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }

  async updateVerifiedUser(phoneNumber: string): Promise<void> {
    try {
      const user: User = await this._userRepository.findOne({
        where: { phoneNumber },
      });

      if (!user) {
        throw applicationError(
          `There no user with phone number = ${phoneNumber}`,
        );
      }

      const auditProps: IAudit = Audit.createAuditProperties(
        AUDIT_BY_SYSTEM,
        CRUD_ACTION.update,
      );
      const audit: Audit = Audit.create(auditProps).getValue();

      const userUpdate = User.update({ isVerified: true }, user, audit);

      await this._userRepository.save(userUpdate);
    } catch (error) {
      this._logger.error(error.message, error);
      throw error;
    }
  }
}
