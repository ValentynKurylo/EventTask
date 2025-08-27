import { UserType } from './user.type';
import {EventCategoryEnum} from "@/common/enums/category.enum";

export type EventType = {
	id: number;
	title: string;
	date: string;
	location: string;
	category: EventCategoryEnum;
	description: string;
	latitude?: number;
	longitude?: number;
	createdAt: string;
	updatedAt: string;
	user: UserType;
};

export type PaginationMetaType = {
	page: number;
	pageSize: number;
	totalItems: number;
	totalPages: number;
};

export type PaginationEventsResponseType = {
	meta: PaginationMetaType;
	items: EventType[];
};
