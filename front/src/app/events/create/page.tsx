'use client';

import {
	Box,
	Button,
	TextField,
	Typography,
	Paper,
	MenuItem,
	CircularProgress,
} from '@mui/material';
import { useForm, Controller } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useCreateEvent } from '@/hooks/useEvents';
import Header from '@/components/Header';
import {EventCategoryEnum} from "@/common/enums/category.enum";

export default function CreateEventPage() {
	const router = useRouter();
	const createEvent = useCreateEvent();

	const {
		handleSubmit,
		control,
		formState: { errors },
	} = useForm({
		defaultValues: {
			title: '',
			date: '',
			location: '',
			category: EventCategoryEnum.TECHNOLOGY,
			description: ''
		},
	});

	const onSubmit = async (data: any) => {
		try {
			await createEvent.mutateAsync(data);
			router.push('/events');
		} catch (err) {
			console.error('Failed to create event:', err);
		}
	};

	return (
		<>
			<Header />
			<Box
				sx={{
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
					minHeight: 'calc(100vh - 64px)',
					bgcolor: 'grey.100',
					px: 2,
				}}
			>
				<Paper
					elevation={3}
					sx={{
						p: 4,
						maxWidth: 600,
						width: '100%',
						borderRadius: 2,
					}}
				>
					<Typography variant="h5" gutterBottom textAlign="center">
						Create New Event
					</Typography>

					<form onSubmit={handleSubmit(onSubmit)}>
						<Controller
							name="title"
							control={control}
							rules={{ required: 'Title is required' }}
							render={({ field }) => (
								<TextField
									{...field}
									label="Title"
									fullWidth
									margin="normal"
									error={!!errors.title}
									helperText={errors.title?.message}
								/>
							)}
						/>

						<Controller
							name="date"
							control={control}
							rules={{ required: 'Date is required' }}
							render={({ field }) => (
								<TextField
									{...field}
									type="datetime-local"
									label="Date & Time"
									fullWidth
									margin="normal"
									InputLabelProps={{ shrink: true }}
									error={!!errors.date}
									helperText={errors.date?.message}
								/>
							)}
						/>

						<Controller
							name="location"
							control={control}
							rules={{ required: 'Location is required' }}
							render={({ field }) => (
								<TextField
									{...field}
									label="Location"
									fullWidth
									margin="normal"
									error={!!errors.location}
									helperText={errors.location?.message}
								/>
							)}
						/>

						<Controller
							name="category"
							control={control}
							render={({ field }) => (
								<TextField
									{...field}
									select
									label="Category"
									fullWidth
									margin="normal"
								>
									{Object.values(EventCategoryEnum).map((cat) => (
										<MenuItem key={cat} value={cat}>
											{cat}
										</MenuItem>
									))}
								</TextField>
							)}
						/>

						<Controller
							name="description"
							control={control}
							rules={{ required: 'Description is required' }}
							render={({ field }) => (
								<TextField
									{...field}
									label="Description"
									multiline
									rows={3}
									fullWidth
									margin="normal"
									error={!!errors.description}
									helperText={errors.description?.message}
								/>
							)}
						/>


						<Button
							type="submit"
							variant="contained"
							color="primary"
							fullWidth
							sx={{ mt: 2 }}
							disabled={createEvent.isLoading}
						>
							{createEvent.isLoading ? (
								<CircularProgress size={24} color="inherit" />
							) : (
								'Create Event'
							)}
						</Button>
					</form>
				</Paper>
			</Box>
		</>
	);
}
