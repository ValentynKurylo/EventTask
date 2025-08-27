'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEvent, useUpdateEvent } from '@/hooks/useEvents';
import { Box, TextField, Button, Typography, CircularProgress, Paper } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useEffect } from 'react';
import { EventType } from '@/types/event.type';

export default function EditEventPage() {
	const { id } = useParams();
	const eventId = Number(id);
	const router = useRouter();

	const { data: event, isLoading } = useEvent(eventId);
	const updateMutation = useUpdateEvent(eventId);

	const { control, handleSubmit, reset } = useForm<Partial<EventType>>({
		defaultValues: {
			title: '',
			date: new Date().toISOString().slice(0, 16), // YYYY-MM-DDTHH:mm
			location: '',
			category: 'TECHNOLOGY',
			description: '',
			latitude: 0,
			longitude: 0,
		},
	});

	useEffect(() => {
		if (event) {
			reset({
				title: event.title || '',
				date: event.date ? new Date(event.date).toISOString().slice(0, 16) : new Date().toISOString().slice(0, 16),
				location: event.location || '',
				category: event.category || 'TECHNOLOGY',
				description: event.description || '',
				latitude: event.latitude ?? 0,
				longitude: event.longitude ?? 0,
			});
		}
	}, [event, reset]);

	const onSubmit = async (data: Partial<EventType>) => {
		try {
			await updateMutation.mutateAsync(data);
			router.push(`/events/${eventId}`);
		} catch (err) {
			console.error('Failed to update event:', err);
		}
	};

	if (isLoading)
		return (
			<Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
				<CircularProgress />
			</Box>
		);

	if (!event)
		return (
			<Box sx={{ p: 4 }}>
				<Typography color="error">Event not found.</Typography>
			</Box>
		);

	return (
		<Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
			<Paper sx={{ p: 4, maxWidth: 600, width: '100%' }}>
				<Typography variant="h5" gutterBottom textAlign="center">
					Edit Event
				</Typography>

				<form onSubmit={handleSubmit(onSubmit)} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
					<Controller
						name="title"
						control={control}
						render={({ field }) => <TextField label="Title" {...field} fullWidth required />}
					/>

					<Controller
						name="date"
						control={control}
						render={({ field }) => <TextField label="Date" type="datetime-local" {...field} fullWidth required />}
					/>

					<Controller
						name="location"
						control={control}
						render={({ field }) => <TextField label="Location" {...field} fullWidth required />}
					/>

					<Controller
						name="category"
						control={control}
						render={({ field }) => <TextField label="Category" {...field} fullWidth required />}
					/>

					<Controller
						name="description"
						control={control}
						render={({ field }) => <TextField label="Description" {...field} fullWidth multiline rows={4} required />}
					/>

					<Controller
						name="latitude"
						control={control}
						render={({ field }) => <TextField label="Latitude" type="number" {...field} fullWidth />}
					/>

					<Controller
						name="longitude"
						control={control}
						render={({ field }) => <TextField label="Longitude" type="number" {...field} fullWidth />}
					/>

					<Button type="submit" variant="contained" color="primary" disabled={updateMutation.isLoading}>
						{updateMutation.isLoading ? 'Updating...' : 'Update Event'}
					</Button>
				</form>
			</Paper>
		</Box>
	);
}
