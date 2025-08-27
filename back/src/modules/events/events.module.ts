import { Module } from '@nestjs/common';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EventEntity, UserEntity } from '../../entities';
import { LocationsService } from '../locations/locations.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from '../users/users.service';

@Module({
  controllers: [EventsController],
  providers: [
    EventsService,
    LocationsService,
    JwtService,
    UsersService,
    ConfigService,
  ],
  imports: [TypeOrmModule.forFeature([EventEntity, UserEntity])],
})
export class EventsModule {}
