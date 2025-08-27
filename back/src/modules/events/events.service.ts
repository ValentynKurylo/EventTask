import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import { CreateEventDto, GetEventsQueryDto, UpdateEventDto } from './dtos';
import { EventEntity, UserEntity } from '../../entities';
import { LocationsService } from '../locations/locations.service';
import { PaginationResponseDto } from '../../common/dtos';
import { GetSimilarQueryDto } from './dtos/get.similar.query.dto';
import { SimilarTypeEnum } from '../../common/enums';

@Injectable()
export class EventsService {
  constructor(
    @InjectRepository(EventEntity)
    private readonly eventsRepository: Repository<EventEntity>,
    private readonly locationService: LocationsService,
  ) {}

  async findAll(
    query: GetEventsQueryDto,
    userId: number,
  ): Promise<PaginationResponseDto<EventEntity>> {
    const { date, category, search, page, limit, sortBy, order, onlyMy } =
      query;

    const qb = this.eventsRepository.createQueryBuilder('event');

    if (date) {
      qb.andWhere('DATE(event.date) = :date', { date });
    }

    if (category) {
      qb.andWhere('event.category = :category', { category });
    }

    if (search) {
      qb.andWhere('event.title ILIKE :search', { search: `%${search}%` });
    }

    if (onlyMy as boolean) {
      qb.andWhere('event.user = :userId', { userId });
    }

    qb.orderBy(`event.${sortBy}`, order)
      .skip((page - 1) * limit)
      .take(limit);

    const [items, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
      items,
    };
  }

  async findOne(id: number): Promise<EventEntity> {
    const event = await this.eventsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    return event;
  }

  async create(dto: CreateEventDto, user: UserEntity): Promise<EventEntity> {
    let event = this.eventsRepository.create({ ...dto, user });

    if (!dto.latitude || !dto.longitude) {
      const coords = await this.locationService.geocodeLocation(dto.location);
      if (coords) {
        event.latitude = coords.latitude;
        event.longitude = coords.longitude;
      }
    }

    return this.eventsRepository.save(event);
  }

  async update(id: number, dto: UpdateEventDto): Promise<EventEntity> {
    const event = await this.findOne(id);
    Object.assign(event, dto);

    if (dto.location && (!dto.latitude || !dto.longitude)) {
      const coords = await this.locationService.geocodeLocation(dto.location);
      if (coords) {
        event.latitude = coords.latitude;
        event.longitude = coords.longitude;
      }
    }

    return this.eventsRepository.save(event);
  }

  async remove(id: number): Promise<EventEntity> {
    const event = await this.findOne(id);
    return this.eventsRepository.remove(event);
  }

  async findSimilar(
    id: number,
    query: GetSimilarQueryDto,
  ): Promise<PaginationResponseDto<EventEntity>> {
    const { by, page, limit } = query;

    switch (by) {
      case SimilarTypeEnum.CATEGORY:
        return this.findSimilarByCategory(id, page, limit);
      case SimilarTypeEnum.DATE:
        return this.findSimilarByDate(id, page, limit);
      case SimilarTypeEnum.LOCATION:
        return this.findSimilarByLocationRadius(id, page, limit);
      default:
        return this.findSimilarByCategory(id, page, limit);
    }
  }

  private async findSimilarByCategory(
    id: number,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponseDto<EventEntity>> {
    const event = await this.findOne(id);

    const [items, totalItems] = await this.eventsRepository.findAndCount({
      where: { category: event.category, id: Not(event.id) },
      take: limit,
      skip: (page - 1) * limit,
    });

    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
      items,
    };
  }

  private async findSimilarByDate(
    id: number,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponseDto<EventEntity>> {
    const event = await this.findOne(id);

    const [items, totalItems] = await this.eventsRepository.findAndCount({
      where: { date: event.date, id: Not(event.id) },
      take: limit,
      skip: (page - 1) * limit,
    });

    return {
      meta: {
        page,
        pageSize: limit,
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
      },
      items,
    };
  }

  private async findSimilarByLocationRadius(
    id: number,
    page = 1,
    limit = 10,
  ): Promise<PaginationResponseDto<EventEntity>> {
    const radiusKm = 50;
    const event = await this.findOne(id);
    if (!event) throw new NotFoundException(`Event with ID ${id} not found`);
    if (!event.latitude || !event.longitude)
      throw new NotFoundException(`Event does not have coordinates`);

    const lat = event.latitude;
    const lng = event.longitude;

    const qb = this.eventsRepository
      .createQueryBuilder('event')
      .addSelect(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(event.latitude)) * cos(radians(event.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(event.latitude))))`,
        'distance',
      )
      .where('event.id != :id', { id })
      .andWhere('event.latitude IS NOT NULL')
      .andWhere('event.longitude IS NOT NULL')
      .andWhere(
        `(6371 * acos(cos(radians(:lat)) * cos(radians(event.latitude)) * cos(radians(event.longitude) - radians(:lng)) + sin(radians(:lat)) * sin(radians(event.latitude)))) <= :radiusKm`,
      )
      .orderBy('distance', 'ASC')
      .setParameters({ lat, lng, radiusKm })
      .skip((page - 1) * limit)
      .take(limit);

    const [items, totalItems] = await qb.getManyAndCount();

    const totalPages = Math.ceil(totalItems / limit);

    return {
      meta: {
        page,
        pageSize: limit,
        totalItems,
        totalPages,
      },
      items,
    };
  }
}
