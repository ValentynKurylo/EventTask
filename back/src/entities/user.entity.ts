import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  BeforeInsert,
  OneToMany,
} from 'typeorm';
import * as bcrypt from 'bcrypt';
import { UserRoleEnum } from '../common/enums';
import { ApiProperty } from '@nestjs/swagger';
import { EventEntity } from './event.entity';

@Entity({ name: 'users' })
export class UserEntity {
  @ApiProperty({ example: 1, description: 'Unique user ID' })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    example: 'user@example.com',
    description: 'User email address',
  })
  @Column({ unique: true })
  email: string;

  @ApiProperty({
    example: 'strongPassword123',
    description: 'User password',
    writeOnly: true,
  })
  @Column({ select: false })
  password: string;

  @ApiProperty({
    example: UserRoleEnum.USER,
    enum: UserRoleEnum,
    description: 'User role',
  })
  @Column({
    type: 'enum',
    enum: UserRoleEnum,
    default: UserRoleEnum.USER,
  })
  role: UserRoleEnum;

  @OneToMany(() => EventEntity, (event) => event.user)
  events: EventEntity[];

  @BeforeInsert()
  async hashPassword(): Promise<void> {
    const saltRounds = 10;
    this.password = await bcrypt.hash(this.password, saltRounds);
  }
}
