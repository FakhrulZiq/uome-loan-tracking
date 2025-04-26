import { User } from 'src/Modules/user/user';

export interface IUserService {
  findByPhoneNumber(username: string): Promise<User>;
  register(input: IResgisterInput): Promise<string>;
  findById(id: string): Promise<User>;
  clearRefreshToken(id: string): Promise<void>;
}

export interface IResgisterInput {
  phoneNumber: string;
  password: string;
  role: string;
}
