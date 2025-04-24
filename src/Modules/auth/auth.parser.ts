import { IUserParser } from 'src/applications/interfaces/authService.interface';
import { User } from '../user/user';

export class AuthParser {
  static validateUserParser(user: User): IUserParser {
    return {
      phoneNumber: user.phoneNumber,
      role: user.role,
    };
  }
}
