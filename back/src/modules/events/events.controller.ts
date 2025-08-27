import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { EventsService } from './events.service';
import {
  ApiTags,
  ApiQuery,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiBody,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { CreateEventDto, GetEventsQueryDto, UpdateEventDto } from './dtos';
import { EventEntity, UserEntity } from '../../entities';
import { GetUser } from '../../decorators';
import { AuthGuard, EventOwnerGuard } from '../../guards';
import { PaginationResponseDto } from '../../common/dtos';
import { GetSimilarQueryDto } from './dtos/get.similar.query.dto';

@ApiTags('Events')
@ApiBearerAuth('access-token')
@UseGuards(AuthGuard)
@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Get()
  @ApiOperation({
    summary: 'Get all events (with filters, pagination, sorting)',
  })
  @ApiResponse({ status: 200, description: 'List of events with pagination' })
  findAll(
    @Query() query: GetEventsQueryDto,
    @GetUser() user: UserEntity,
  ): Promise<PaginationResponseDto<EventEntity>> {
    return this.eventsService.findAll(query, user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get event by ID' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event found', type: EventEntity })
  @ApiResponse({ status: 404, description: 'Event not found' })
  findOne(@Param('id') id: number): Promise<EventEntity> {
    return this.eventsService.findOne(id);
  }

  @Get(':id/similar')
  @ApiOperation({
    summary: 'Get similar events (paginated by category, location, or date)',
  })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of similar events',
    type: PaginationResponseDto<EventEntity>,
  })
  findSimilar(
    @Param('id') id: number,
    @Query() query: GetSimilarQueryDto,
  ): Promise<PaginationResponseDto<EventEntity>> {
    return this.eventsService.findSimilar(id, query);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new event' })
  @ApiBody({ type: CreateEventDto })
  @ApiResponse({
    status: 201,
    description: 'Event created successfully',
    type: EventEntity,
  })
  create(
    @Body() createEventDto: CreateEventDto,
    @GetUser() user: UserEntity,
  ): Promise<EventEntity> {
    return this.eventsService.create(createEventDto, user);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an event' })
  @ApiParam({ name: 'id', type: Number })
  @ApiBody({ type: UpdateEventDto })
  @ApiResponse({
    status: 200,
    description: 'Event updated successfully',
    type: EventEntity,
  })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @UseGuards(EventOwnerGuard)
  update(
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<EventEntity> {
    return this.eventsService.update(+id, updateEventDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete an event' })
  @ApiParam({ name: 'id', type: Number })
  @ApiResponse({ status: 200, description: 'Event deleted successfully' })
  @ApiResponse({ status: 404, description: 'Event not found' })
  @UseGuards(EventOwnerGuard)
  remove(@Param('id') id: string): Promise<EventEntity> {
    return this.eventsService.remove(+id);
  }
}
