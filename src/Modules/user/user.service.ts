import { ConflictException, Inject, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { AUDIT_BY_SYSTEM, CRUD_ACTION, TYPES } from 'src/applications/constant';
import { IAudit } from 'src/applications/interfaces/audit.interface';
import { IUserRepository } from 'src/applications/interfaces/userRepository.interface';
import {
  IResgisterInput,
  IUserService,
} from 'src/applications/interfaces/userService.interface';
import { Audit } from 'src/domain/audit/audit';
import { IContextAwareLogger } from 'src/infrastructure/logger';
import { User } from './user';
import { applicationError } from 'src/utilities/exceptionInstance';

@Injectable()
export class UserService implements IUserService {
  constructor(
    @Inject(TYPES.IApplicationLogger)
    private readonly _logger: IContextAwareLogger,
    @Inject(TYPES.IUserRepository)
    private readonly _userRepository: IUserRepository,
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

  async register(input: IResgisterInput): Promise<string> {
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
        audit,
      }).getValue();

      const savedUser = this._userRepository.save(newUser);

      if (!savedUser) {
        throw applicationError(
          `Unable to create a new user with this ${phoneNumber} phone number`,
        );
      }

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
}
