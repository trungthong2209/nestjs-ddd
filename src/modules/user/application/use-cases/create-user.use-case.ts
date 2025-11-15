import { Inject, Injectable, ConflictException } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserName } from '../../domain/value-objects/user-name.value-object';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class CreateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(dto: CreateUserDto): Promise<UserResponseDto> {
    // Create value objects
    const email = Email.create(dto.email);
    const name = UserName.create(dto.firstName, dto.lastName);

    // Check if user already exists
    const existingUser = await this.userRepository.findByEmail(email);
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Create user entity
    const user = User.create(email, name);

    // Save user
    await this.userRepository.save(user);

    // Return response
    return this.toResponseDto(user);
  }

  private toResponseDto(user: User): UserResponseDto {
    return new UserResponseDto({
      id: user.getId().getValue(),
      email: user.getEmail().getValue(),
      firstName: user.getName().getFirstName(),
      lastName: user.getName().getLastName(),
      fullName: user.getName().getFullName(),
      createdAt: user.getCreatedAt(),
      updatedAt: user.getUpdatedAt(),
    });
  }
}

