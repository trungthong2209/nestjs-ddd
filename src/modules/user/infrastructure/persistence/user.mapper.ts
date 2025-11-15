import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserName } from '../../domain/value-objects/user-name.value-object';

export interface UserPersistence {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  createdAt: string;
  updatedAt: string;
}

export class UserMapper {
  static toPersistence(user: User): UserPersistence {
    return {
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      firstName: user.getName().getFirstName(),
      lastName: user.getName().getLastName(),
      createdAt: user.getCreatedAt().toISOString(),
      updatedAt: user.getUpdatedAt().toISOString(),
    };
  }

  static toDomain(raw: UserPersistence): User {
    const id = UserId.from(raw.id);
    const email = Email.create(raw.email);
    const name = UserName.create(raw.firstName, raw.lastName);
    const createdAt = new Date(raw.createdAt);
    const updatedAt = new Date(raw.updatedAt);

    return User.reconstitute(id, email, name, createdAt, updatedAt);
  }
}

