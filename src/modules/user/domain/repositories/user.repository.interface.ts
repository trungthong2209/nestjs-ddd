import { User } from '../entities/user.entity';
import { UserId } from '../value-objects/user-id.value-object';
import { Email } from '../value-objects/email.value-object';

export interface IUserRepository {
  save(user: User): Promise<void>;
  findById(id: UserId): Promise<User | null>;
  findByEmail(email: Email): Promise<User | null>;
  findAll(): Promise<User[]>;
  delete(id: UserId): Promise<void>;
  exists(id: UserId): Promise<boolean>;
}

export const USER_REPOSITORY = Symbol('USER_REPOSITORY');

