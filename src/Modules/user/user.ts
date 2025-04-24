import { IUser } from 'src/applications/interfaces/user.interface';
import { Audit } from 'src/domain/audit/audit';
import { Entity } from 'src/domain/entity';
import { Result } from 'src/domain/result';
import { updateEntity } from 'src/utilities/utils';

export class User extends Entity implements IUser {
  phoneNumber: string;
  password: string;
  role: string;
  refreshToken?: string;
  audit: Audit;

  constructor(id: string, props: IUser) {
    super(id);
    this.phoneNumber = props.phoneNumber;
    this.password = props.password;
    this.role = props.role;
    this.refreshToken = props.refreshToken;
    this.audit = props.audit;
  }

  static create(props: IUser, id?: string): Result<User> {
    return Result.ok<User>(new User(id, props));
  }

  static update(props: Partial<IUser>, borrower: User, audit: Audit): User {
    return updateEntity(props, borrower, audit);
  }
}
