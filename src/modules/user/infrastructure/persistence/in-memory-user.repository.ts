import { Injectable } from '@nestjs/common';
import NodeCache from 'node-cache';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { User } from '../../domain/entities/user.entity';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserMapper, UserPersistence } from './user.mapper';

@Injectable()
export class InMemoryUserRepository implements IUserRepository {
  private readonly cache: NodeCache;
  private readonly USERS_KEY = 'users';
  private readonly EMAIL_INDEX_KEY = 'email_index';

  constructor() {
    this.cache = new NodeCache({ stdTTL: 0, checkperiod: 0 }); // No expiration
    this.initializeCache();
  }

  private initializeCache(): void {
    if (!this.cache.has(this.USERS_KEY)) {
      this.cache.set(this.USERS_KEY, new Map<string, UserPersistence>());
    }
    if (!this.cache.has(this.EMAIL_INDEX_KEY)) {
      this.cache.set(this.EMAIL_INDEX_KEY, new Map<string, string>());
    }
  }

  private getUsers(): Map<string, UserPersistence> {
    return this.cache.get(this.USERS_KEY) as Map<string, UserPersistence>;
  }

  private getEmailIndex(): Map<string, string> {
    return this.cache.get(this.EMAIL_INDEX_KEY) as Map<string, string>;
  }

  async save(user: User): Promise<void> {
    const users = this.getUsers();
    const emailIndex = this.getEmailIndex();
    const persistence = UserMapper.toPersistence(user);

    users.set(persistence.id, persistence);
    emailIndex.set(persistence.email, persistence.id);

    this.cache.set(this.USERS_KEY, users);
    this.cache.set(this.EMAIL_INDEX_KEY, emailIndex);
  }

  async findById(id: UserId): Promise<User | null> {
    const users = this.getUsers();
    const persistence = users.get(id.getValue());

    if (!persistence) {
      return null;
    }

    return UserMapper.toDomain(persistence);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const emailIndex = this.getEmailIndex();
    const userId = emailIndex.get(email.getValue());

    if (!userId) {
      return null;
    }

    return this.findById(UserId.from(userId));
  }

  async findAll(): Promise<User[]> {
    const users = this.getUsers();
    const userArray: User[] = [];

    for (const persistence of users.values()) {
      userArray.push(UserMapper.toDomain(persistence));
    }

    return userArray;
  }

  async delete(id: UserId): Promise<void> {
    const users = this.getUsers();
    const emailIndex = this.getEmailIndex();
    const persistence = users.get(id.getValue());

    if (persistence) {
      users.delete(id.getValue());
      emailIndex.delete(persistence.email);

      this.cache.set(this.USERS_KEY, users);
      this.cache.set(this.EMAIL_INDEX_KEY, emailIndex);
    }
  }

  async exists(id: UserId): Promise<boolean> {
    const users = this.getUsers();
    return users.has(id.getValue());
  }
}

