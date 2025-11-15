import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { UserResponseDto } from '../dtos/user-response.dto';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserId } from '../../domain/value-objects/user-id.value-object';
import { User } from '../../domain/entities/user.entity';

@Injectable()
export class GetUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<UserResponseDto> {
    const id = UserId.from(userId);
    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

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

