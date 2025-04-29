import { User } from 'src/Modules/user/user';

export interface IUserService {
  findByPhoneNumber(username: string): Promise<User>;
  register(input: IResgisterInput): Promise<IRegisterResponse>;
  findById(id: string): Promise<User>;
  clearRefreshToken(id: string): Promise<void>;
  registerUserBorrower(
    phoneNumber: string,
    password: string,
    borrowerId: string,
  ): Promise<string>;
  updateVerifiedUser(phoneNumber: string): Promise<void>;
}

export interface IResgisterInput {
  phoneNumber: string;
  password: string;
  role: string;
}

export interface IRegisterResponse {
  message: string;
}
