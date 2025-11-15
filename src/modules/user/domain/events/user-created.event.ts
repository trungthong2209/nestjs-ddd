import { UserId } from '../value-objects/user-id.value-object';

export class UserCreatedEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly userId: UserId,
    public readonly email: string,
    public readonly fullName: string,
  ) {
    this.occurredOn = new Date();
  }
}

