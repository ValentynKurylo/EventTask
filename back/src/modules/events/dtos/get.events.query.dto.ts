import { ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsOptional,
  IsString,
  IsNumber,
  IsIn,
  Min,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  EventCategoryEnum,
  OrderByEnum,
  OrderEnum,
  SimilarTypeEnum,
} from '../../../common/enums';

export class GetEventsQueryDto {
  @ApiPropertyOptional({ description: 'Filter by date (YYYY-MM-DD)' })
  @IsOptional()
  @IsString()
  date?: string;

  @ApiPropertyOptional({ description: 'Filter by category' })
  @IsOptional()
  @IsEnum(EventCategoryEnum)
  category?: EventCategoryEnum;

  @ApiPropertyOptional({ description: 'Search by title' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ description: 'Page number', default: 1 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  page: number = 1;

  @ApiPropertyOptional({ description: 'Items per page', default: 10 })
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  limit: number = 10;

  @ApiPropertyOptional({
    description: 'Sort by field (date or title)',
    enum: ['date', 'title'],
    default: 'date',
  })
  @IsEnum(OrderByEnum)
  sortBy: OrderByEnum = OrderByEnum.DATE;

  @ApiPropertyOptional({
    description: 'Sort order (ASC or DESC)',
    enum: ['ASC', 'DESC'],
    default: 'ASC',
  })
  @IsOptional()
  @IsEnum(OrderEnum)
  order: OrderEnum = OrderEnum.ASC;

  @ApiPropertyOptional({
    description: 'Show only my own events',
    example: true,
  })
  @Transform(({ value }) => value === 'true')
  @IsBoolean()
  onlyMy: boolean = false;
}
