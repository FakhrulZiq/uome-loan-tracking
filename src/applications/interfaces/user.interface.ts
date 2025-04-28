import { Audit } from 'src/domain/audit/audit';

export interface IUser {
  password: string;
  phoneNumber: string;
  role: string;
  refreshToken?: string;
  borrowerId?: string;
  isVerified: boolean;
  audit: Audit;
}
