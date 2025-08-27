import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventsService } from '../modules/events/events.service';
import { UserEntity } from '../entities';
import { UserRoleEnum } from '../common/enums';

@Injectable()
export class EventOwnerGuard implements CanActivate {
  constructor(private readonly eventsService: EventsService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user: UserEntity = request.user;
    if (user.role === UserRoleEnum.ADMIN) return true;

    const eventId = request.params.id;
    const event = await this.eventsService.findOne(+eventId);
    if (!event) throw new NotFoundException('Event not found');

    if (event.user.id !== user.id) {
      throw new ForbiddenException('You are not allowed to modify this event');
    }

    return true;
  }
}
