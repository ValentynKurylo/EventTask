import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsStrongPassword, MinLength } from 'class-validator';

export class UserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'securePass123!' })
  @MinLength(6)
  @IsStrongPassword()
  password: string;
}
