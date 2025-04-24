import { Injectable } from '@nestjs/common';
import { IMapper } from 'src/applications/interfaces/mapper.interface';
import { AuditMapper } from 'src/domain/audit/audit.mapper';
import { UserModel } from 'src/infrastructure/dataAccess/models/user.entity';
import { User } from './user';

@Injectable()
export class UserMapper implements IMapper<User, UserModel> {
  toPersistence(entity: User): UserModel {
    const { password, phoneNumber, role, refreshToken, audit } = entity;

    const {
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    } = audit;

    const model: UserModel = {
      id: entity.id,
      password,
      phoneNumber,
      role,
      refreshToken,
      auditCreatedBy,
      auditCreatedDateTime,
      auditDeletedBy,
      auditDeletedDateTime,
      auditModifiedBy,
      auditModifiedDateTime,
    };
    return model;
  }

  toDomain(model: UserModel): User {
    const { password, id, phoneNumber, refreshToken, role } = model;

    return User.create(
      {
        password,
        phoneNumber,
        role,
        refreshToken,
        audit: new AuditMapper().toDomain(model),
      },
      id,
    ).getValue();
  }
}
