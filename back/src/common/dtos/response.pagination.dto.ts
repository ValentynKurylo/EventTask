import { ApiProperty } from '@nestjs/swagger';

export class PaginationMeta {
  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 10 })
  pageSize: number;

  @ApiProperty({ example: 100 })
  totalItems: number;

  @ApiProperty({ example: 10 })
  totalPages: number;
}

export class PaginationResponseDto<T> {
  @ApiProperty({ type: () => PaginationMeta })
  meta: PaginationMeta;

  @ApiProperty({ isArray: true })
  items: T[];
}
