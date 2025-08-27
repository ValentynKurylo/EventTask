import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsOptional,
  IsNumber,
  IsEnum,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EventCategoryEnum } from '../../../common/enums';

export class CreateEventDto {
  @ApiProperty({ example: 'Test Event' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: '2025-08-26T19:00:00Z' })
  @IsDateString()
  date: Date;

  @ApiProperty({ example: 'Lviv, Narodna 14' })
  @IsString()
  @IsNotEmpty()
  location: string;

  @ApiProperty({
    enum: EventCategoryEnum,
    example: EventCategoryEnum.TECHNOLOGY,
  })
  @IsEnum(EventCategoryEnum, {
    message: 'Category must be a valid EventCategory',
  })
  category: EventCategoryEnum;

  @ApiProperty({ example: 'test description' })
  @IsString()
  description: string;

  @ApiProperty({ required: false, example: 44.8973 })
  @IsOptional()
  @IsNumber()
  latitude?: number;

  @ApiProperty({ required: false, example: 34.7748 })
  @IsOptional()
  @IsNumber()
  longitude?: number;
}
