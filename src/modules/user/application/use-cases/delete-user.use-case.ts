import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import type { IUserRepository } from '../../domain/repositories/user.repository.interface';
import { USER_REPOSITORY } from '../../domain/repositories/user.repository.interface';
import { UserId } from '../../domain/value-objects/user-id.value-object';

@Injectable()
export class DeleteUserUseCase {
  constructor(
    @Inject(USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
  ) {}

  async execute(userId: string): Promise<void> {
    const id = UserId.from(userId);
    const exists = await this.userRepository.exists(id);

    if (!exists) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    await this.userRepository.delete(id);
  }
}

