import { UserId } from '../value-objects/user-id.value-object';

export class UserUpdatedEvent {
  public readonly occurredOn: Date;

  constructor(
    public readonly userId: UserId,
    public readonly changes: Record<string, any>,
  ) {
    this.occurredOn = new Date();
  }
}

