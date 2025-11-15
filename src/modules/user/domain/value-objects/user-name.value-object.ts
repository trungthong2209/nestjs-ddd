export class UserName {
  private readonly firstName: string;
  private readonly lastName: string;

  private constructor(firstName: string, lastName: string) {
    this.firstName = firstName;
    this.lastName = lastName;
  }

  static create(firstName: string, lastName: string): UserName {
    if (!firstName || firstName.trim().length === 0) {
      throw new Error('First name cannot be empty');
    }
    if (!lastName || lastName.trim().length === 0) {
      throw new Error('Last name cannot be empty');
    }
    if (firstName.length < 2 || firstName.length > 50) {
      throw new Error('First name must be between 2 and 50 characters');
    }
    if (lastName.length < 2 || lastName.length > 50) {
      throw new Error('Last name must be between 2 and 50 characters');
    }
    return new UserName(firstName.trim(), lastName.trim());
  }

  getFirstName(): string {
    return this.firstName;
  }

  getLastName(): string {
    return this.lastName;
  }

  getFullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  equals(other: UserName): boolean {
    if (!other) return false;
    return (
      this.firstName === other.firstName && this.lastName === other.lastName
    );
  }

  toString(): string {
    return this.getFullName();
  }
}

