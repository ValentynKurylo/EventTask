import { ApiProperty } from '@nestjs/swagger';
import { SimilarTypeEnum } from '../../../common/enums';
import { IsEnum, IsInt, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class GetSimilarQueryDto {
  @ApiProperty({
    enum: SimilarTypeEnum,
    description: 'Choose similarity criteria',
    example: SimilarTypeEnum.CATEGORY,
  })
  @IsEnum(SimilarTypeEnum, {
    message: 'by must be one of category | location | date',
  })
  by: SimilarTypeEnum;

  @ApiProperty({ example: 1, required: false, type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @ApiProperty({ example: 10, required: false, type: Number })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit = 10;
}
