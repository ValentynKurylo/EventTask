import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UsersService } from '../users/users.service';
import { UserDto } from '../users/dtos';
import { TokenPayloadDto, TokenResponseDto } from '../../common/dtos';
import { JwtService } from '@nestjs/jwt';
import { UserEntity } from '../../entities';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(data: UserDto): Promise<TokenResponseDto> {
    const candidate = await this.userService.getByEmail(data.email);
    if (candidate)
      throw new BadRequestException(`User with such email already exist`);
    const user = await this.userService.create(data);
    const token = this.jwtService.sign({ id: user.id });
    return { token, user: { id: user.id, role: user.role } };
  }

  async login(data: UserDto): Promise<TokenResponseDto> {
    const user = await this.validateUser(data.email, data.password);
    const token = this.generateToken({ id: user.id });
    return { token, user: { id: user.id, role: user.role } };
  }

  private generateToken(payload: TokenPayloadDto): string {
    return this.jwtService.sign(payload);
  }

  private async validateUser(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userService.getByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return user;
  }
}
