import { UserId } from '../value-objects/user-id.value-object';
import { Email } from '../value-objects/email.value-object';
import { UserName } from '../value-objects/user-name.value-object';
import { UserCreatedEvent } from '../events/user-created.event';
import { UserUpdatedEvent } from '../events/user-updated.event';

export class User {
  private readonly id: UserId;
  private email: Email;
  private name: UserName;
  private readonly createdAt: Date;
  private updatedAt: Date;
  private domainEvents: any[] = [];

  private constructor(
    id: UserId,
    email: Email,
    name: UserName,
    createdAt: Date,
    updatedAt: Date,
  ) {
    this.id = id;
    this.email = email;
    this.name = name;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
  }

  static create(email: Email, name: UserName): User {
    const id = UserId.create();
    const now = new Date();
    const user = new User(id, email, name, now, now);

    // Add domain event
    user.addDomainEvent(
      new UserCreatedEvent(id, email.getValue(), name.getFullName()),
    );

    return user;
  }

  static reconstitute(
    id: UserId,
    email: Email,
    name: UserName,
    createdAt: Date,
    updatedAt: Date,
  ): User {
    return new User(id, email, name, createdAt, updatedAt);
  }

  // Getters
  getId(): UserId {
    return this.id;
  }

  getEmail(): Email {
    return this.email;
  }

  getName(): UserName {
    return this.name;
  }

  getCreatedAt(): Date {
    return this.createdAt;
  }

  getUpdatedAt(): Date {
    return this.updatedAt;
  }

  // Business logic
  updateEmail(newEmail: Email): void {
    if (this.email.equals(newEmail)) {
      return;
    }

    const oldEmail = this.email.getValue();
    this.email = newEmail;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new UserUpdatedEvent(this.id, { email: { old: oldEmail, new: newEmail.getValue() } }),
    );
  }

  updateName(newName: UserName): void {
    if (this.name.equals(newName)) {
      return;
    }

    const oldName = this.name.getFullName();
    this.name = newName;
    this.updatedAt = new Date();

    this.addDomainEvent(
      new UserUpdatedEvent(this.id, { name: { old: oldName, new: newName.getFullName() } }),
    );
  }

  // Domain events management
  getDomainEvents(): any[] {
    return [...this.domainEvents];
  }

  clearDomainEvents(): void {
    this.domainEvents = [];
  }

  private addDomainEvent(event: any): void {
    this.domainEvents.push(event);
  }
}

