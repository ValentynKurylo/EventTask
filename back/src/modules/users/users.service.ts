import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from '../../entities';
import { UserDto } from './dtos';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly usersRepository: Repository<UserEntity>,
  ) {}

  async create(data: UserDto): Promise<UserEntity> {
    const user = await this.usersRepository.create(data);
    return this.usersRepository.save(user);
  }

  async getById(id: number): Promise<UserEntity | null> {
    return this.usersRepository.findOneById(id);
  }

  async getByEmail(email: string): Promise<UserEntity | null> {
    const user = await this.usersRepository
      .createQueryBuilder('user')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    return user;
  }
}
