import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/utils/api';
import { EventType, PaginationEventsResponseType } from '@/types/event.type';
import {SimilarTypeEnum} from "@/common/enums/similar.type.enum";

export const useEvents = (params?: Record<string, any>) =>
	useQuery<PaginationEventsResponseType>({
		queryKey: ['events', params],
		queryFn: async () => {
			const { data } = await api.get<PaginationEventsResponseType>('/events', {
				params: {
					page: 1,
					limit: 9,
					...params,
				},
			});
			return data;
		},
		keepPreviousData: true,
	});

export const useEvent = (id?: number) =>
	useQuery<EventType>({
		queryKey: ['event', id],
		queryFn: async () => {
			if (!id) throw new Error('Invalid event ID');
			const { data } = await api.get<EventType>(`/events/${id}`);
			return data;
		},
		enabled: !!id,
	});

export function useSimilarEvents(eventId: number, by: SimilarTypeEnum) {
	return useQuery<PaginationEventsResponseType>({
		queryKey: ["similar-events", eventId, by],
		queryFn: async () => {
			const { data } = await api.get(
				`/events/${eventId}/similar`,
				{ params: { by } }
			);
			return data;
		},
		enabled: !!eventId,
	});
}

export const useCreateEvent = () => {
	const queryClient = useQueryClient();
	return useMutation<EventType, unknown, Partial<EventType>>({
		mutationFn: async dto => {
			const { data } = await api.post<EventType>('/events', dto);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
};

export const useUpdateEvent = (id: number) => {
	const queryClient = useQueryClient();
	return useMutation<EventType, unknown, Partial<EventType>>({
		mutationFn: async dto => {
			const { data } = await api.put<EventType>(`/events/${id}`, dto);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['event', id] });
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
};

export const useDeleteEvent = () => {
	const queryClient = useQueryClient();
	return useMutation<EventType, unknown, number>({
		mutationFn: async id => {
			const { data } = await api.delete<EventType>(`/events/${id}`);
			return data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['events'] });
		},
	});
};
