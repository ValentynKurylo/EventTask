import { ApiProperty } from '@nestjs/swagger';
import { UserRoleEnum } from '../enums';

export class UserDto {
  @ApiProperty({ example: 1, description: 'Unique identifier of the user' })
  id: number;

  @ApiProperty({
    example: UserRoleEnum.USER,
    enum: UserRoleEnum,
    description: 'Role of the user',
  })
  role: UserRoleEnum;
}

export class TokenResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  token: string;

  @ApiProperty({ type: () => UserDto })
  user: UserDto;
}
