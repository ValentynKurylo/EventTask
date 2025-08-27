'use client';

import {useParams, useRouter} from 'next/navigation';
import {useEvent, useDeleteEvent} from '@/hooks/useEvents';
import {
	Box,
	Typography,
	Card,
	CardContent,
	Button,
	CircularProgress,
	Dialog,
	DialogTitle,
	DialogContent,
	DialogActions,
} from '@mui/material';
import Link from 'next/link';
import {useState} from 'react';
import SimilarEvents from "@/components/SimilarEvents";
import {getUser} from "@/hooks/useAuth";
import {UserRoleEnum} from "@/common/enums/user.role.enum";


export default function EventDetailsPage() {
	const {id} = useParams();
	const router = useRouter();
	const eventId = Number(id);

	const {data: event, isLoading, error} = useEvent(eventId);
	const deleteMutation = useDeleteEvent();
	const [confirmOpen, setConfirmOpen] = useState(false);

	const user = getUser()

	if (isLoading)
		return (
			<Box sx={{display: 'flex', justifyContent: 'center', mt: 8}}>
				<CircularProgress/>
			</Box>
		);

	if (error || !event)
		return (
			<Box sx={{p: 4}}>
				<Typography color="error">Event not found.</Typography>
				<Button component={Link} href="/events" sx={{mt: 2}}>
					Back to Events
				</Button>
			</Box>
		);

	const handleDelete = async () => {
		try {
			await deleteMutation.mutateAsync(eventId);
			router.push('/events');
		} catch (err) {
			console.error('Failed to delete event:', err);
		}
	};

	const canManage =
		user?.role === UserRoleEnum.ADMIN || user?.id === event.user.id;

	return (
		<>
			<Box sx={{p: 4, maxWidth: 800, mx: 'auto'}}>
				<Card>
					<CardContent>
						<Typography variant="h4" gutterBottom>
							{event.title}
						</Typography>
						<Typography variant="subtitle1" gutterBottom>
							{new Date(event.date).toLocaleString()}
						</Typography>
						<Typography variant="subtitle2" gutterBottom>
							Location: {event.location}
						</Typography>
						<Typography variant="body1" gutterBottom>
							Category: {event.category}
						</Typography>
						<Typography variant="body1" gutterBottom>
							{event.description}
						</Typography>

						{event.latitude && event.longitude && (
							<Box sx={{mt: 2}}>
								<iframe
									width="100%"
									height="300"
									style={{border: 0}}
									loading="lazy"
									allowFullScreen
									src={`https://www.google.com/maps?q=${event.latitude},${event.longitude}&output=embed`}
								/>
							</Box>
						)}

						<Box sx={{mt: 3, display: 'flex', gap: 2}}>
							{canManage && (
								<>
									<Button
										component={Link}
										href={`/events/${event.id}/edit`}
										variant="contained"
									>
										Edit Event
									</Button>
									<Button
										variant="outlined"
										color="error"
										onClick={() => setConfirmOpen(true)}
									>
										Delete Event
									</Button>
								</>
							)}
							<Button component={Link} href="/events" variant="outlined">
								Back to Events
							</Button>
						</Box>

						<Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
							<DialogTitle>Confirm Delete</DialogTitle>
							<DialogContent>
								<Typography>
									Are you sure you want to delete this event? This action cannot
									be undone.
								</Typography>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
								<Button
									onClick={handleDelete}
									color="error"
									variant="contained"
									disabled={deleteMutation.isLoading}
								>
									{deleteMutation.isLoading ? 'Deleting...' : 'Delete'}
								</Button>
							</DialogActions>
						</Dialog>
					</CardContent>
				</Card>
			</Box>
			<SimilarEvents eventId={event.id}/>
		</>
	);
}
