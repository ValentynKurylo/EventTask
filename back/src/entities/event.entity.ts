import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { UserEntity } from './user.entity';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategoryEnum } from '../common/enums';

@Entity({ name: 'events' })
export class EventEntity {
  @PrimaryGeneratedColumn()
  @ApiProperty({ example: 1 })
  id: number;

  @Column({ length: 150 })
  @ApiProperty({ example: 'Tech Conference 2025' })
  title: string;

  @Column({ type: 'timestamp' })
  @ApiProperty({ example: '2025-09-15T10:00:00Z' })
  date: Date;

  @Column({ length: 255 })
  @ApiProperty({ example: 'New York Convention Center' })
  location: string;

  @Column({ type: 'enum', enum: EventCategoryEnum })
  @ApiProperty({
    enum: EventCategoryEnum,
    example: EventCategoryEnum.TECHNOLOGY,
  })
  category: EventCategoryEnum;

  @Column({ type: 'text' })
  @ApiProperty({ example: 'A conference about the latest in AI and tech.' })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  @ApiProperty({ example: 40.712776, required: false })
  latitude: number;

  @Column({ type: 'decimal', precision: 10, scale: 6, nullable: true })
  @ApiProperty({ example: -74.005974, required: false })
  longitude: number;

  @CreateDateColumn()
  @ApiProperty({ example: '2025-08-26T12:00:00Z' })
  createdAt: Date;

  @UpdateDateColumn()
  @ApiProperty({ example: '2025-08-26T13:00:00Z' })
  updatedAt: Date;

  @ManyToOne(() => UserEntity, (user) => user.events, { onDelete: 'CASCADE' })
  @ApiProperty({ type: () => UserEntity })
  user: UserEntity;
}
