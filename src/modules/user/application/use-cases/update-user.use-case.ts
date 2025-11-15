import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { UserResponseDto } from '../dtos/user-response.dto';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { Email } from '../../domain/value-objects/email.value-object';
import { UserName } from '../../domain/value-objects/user-name.value-object';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string, dto: UpdateUserDto): Promise<UserResponseDto> {
    const id = UserId.from(userId);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    // Update email if provided
    if (dto.email) {
      const newEmail = Email.create(dto.email);
      user.updateEmail(newEmail);
    }

    // Update name if provided
    if (dto.firstName || dto.lastName) {
      const firstName = dto.firstName || user.getName().getFirstName();
      const lastName = dto.lastName || user.getName().getLastName();
      const newName = UserName.create(firstName, lastName);
      user.updateName(newName);
    }

    // Save updated user
    await this.userRepository.save(user);

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

