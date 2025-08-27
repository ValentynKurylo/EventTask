'use client';

import { useState } from 'react';
import {
	Box,
	Typography,
	Grid,
	Card,
	CardContent,
	Button,
	CircularProgress,
	TextField,
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Pagination,
	Stack,
	ToggleButton,
	ToggleButtonGroup,
	Switch,
	FormControlLabel,
} from '@mui/material';
import Link from 'next/link';
import { useEvents } from '@/hooks/useEvents';
import { EventType } from '@/types/event.type';
import { OrderByEnum, OrderEnum } from '@/common/enums/order.by.enum';
import { EventCategoryEnum } from '@/common/enums/category.enum';
import Header from '@/components/Header';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';
import { useRouter } from 'next/navigation';

const mapContainerStyle = { width: '100%', height: '600px' };

export default function EventsPage() {
	const router = useRouter();
	const [page, setPage] = useState(1);
	const [search, setSearch] = useState('');
	const [category, setCategory] = useState('');
	const [sortBy, setSortBy] = useState<OrderByEnum>(OrderByEnum.DATE);
	const [order, setOrder] = useState<OrderEnum>(OrderEnum.DESC);
	const [date, setDate] = useState('');
	const [view, setView] = useState<'list' | 'map'>('list');
	const [onlyMy, setOnlyMy] = useState(false);

	const { data, isLoading, error } = useEvents({
		page,
		limit: 9,
		search,
		category: category || undefined,
		sortBy,
		order,
		date: date || undefined,
		onlyMy,
	});

	const { isLoaded } = useJsApiLoader({
		googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY || '',
	});

	return (
		<>
			<Header />
			<Box sx={{ p: { xs: 2, md: 4 } }}>
				<Typography variant="h4" gutterBottom align="center">
					Explore Events
				</Typography>

				<Stack
					direction={{ xs: 'column', sm: 'row' }}
					spacing={2}
					sx={{ mb: 3, justifyContent: 'center', flexWrap: 'wrap', alignItems: 'center' }}
				>
					<TextField
						label="Search by title"
						variant="outlined"
						size="small"
						value={search}
						onChange={(e) => setSearch(e.target.value)}
					/>

					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Category</InputLabel>
						<Select
							value={category}
							label="Category"
							onChange={(e) => setCategory(e.target.value)}
						>
							<MenuItem value="">All</MenuItem>
							{Object.values(EventCategoryEnum).map((cat) => (
								<MenuItem key={cat} value={cat}>
									{cat}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					<TextField
						label="Date"
						type="date"
						variant="outlined"
						size="small"
						value={date}
						onChange={(e) => setDate(e.target.value)}
						InputLabelProps={{ shrink: true }}
					/>

					<FormControl size="small" sx={{ minWidth: 150 }}>
						<InputLabel>Sort By</InputLabel>
						<Select
							value={sortBy}
							label="Sort By"
							onChange={(e) => setSortBy(e.target.value as OrderByEnum)}
						>
							<MenuItem value={OrderByEnum.DATE}>Date</MenuItem>
							<MenuItem value={OrderByEnum.TITLE}>Title</MenuItem>
						</Select>
					</FormControl>

					<FormControl size="small" sx={{ minWidth: 120 }}>
						<InputLabel>Order</InputLabel>
						<Select
							value={order}
							label="Order"
							onChange={(e) => setOrder(e.target.value as OrderEnum)}
						>
							<MenuItem value={OrderEnum.ASC}>Ascending</MenuItem>
							<MenuItem value={OrderEnum.DESC}>Descending</MenuItem>
						</Select>
					</FormControl>

					<FormControlLabel
						control={
							<Switch
								checked={onlyMy}
								onChange={(e) => setOnlyMy(e.target.checked)}
								color="primary"
							/>
						}
						label="Only My Events"
					/>

					<ToggleButtonGroup
						value={view}
						exclusive
						onChange={(_, newView) => newView && setView(newView)}
						sx={{ ml: 2 }}
					>
						<ToggleButton value="list">List View</ToggleButton>
						<ToggleButton value="map">Map View</ToggleButton>
					</ToggleButtonGroup>
				</Stack>

				{isLoading ? (
					<CircularProgress sx={{ display: 'block', mx: 'auto', mt: 4 }} />
				) : !data?.items?.length ? (
					<Typography align="center">No events found.</Typography>
				) : view === 'list' ? (
					<Grid container spacing={3} sx={{ display: 'flex', justifyContent: 'space-between' }}>
						{data.items.map((event: EventType) => (
							<Grid item xs={12} sm={6} md={4} key={event.id}  sx = {{ width: '100%', maxWidth: '400px'}}>
								<Card
									sx={{
										borderRadius: 3,
										boxShadow: 3,
										transition: '0.3s',
										height: '100%',
										display: 'flex',
										flexDirection: 'column',
										'&:hover': { boxShadow: 6, transform: 'translateY(-3px)' },
									}}
								>
									<CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
										<Box>
											<Typography variant="h6" gutterBottom>
												{event.title}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{new Date(event.date).toLocaleString()}
											</Typography>
											<Typography variant="body2" color="text.secondary">
												{event.location}
											</Typography>
										</Box>
										<Button
											component={Link}
											href={`/events/${event.id}`}
											size="small"
											variant="outlined"
											fullWidth
											sx={{ mt: 2 }}
										>
											View Details
										</Button>
									</CardContent>
								</Card>
							</Grid>
						))}
					</Grid>
				) : isLoaded ? (
					<Box sx={{ height: 600 }}>
						<GoogleMap
							mapContainerStyle={mapContainerStyle}
							center={
								data.items.length > 0
									? { lat: Number(data.items[0].latitude), lng: Number(data.items[0].longitude) }
									: { lat: 0, lng: 0 }
							}
							zoom={3}
						>
							{data.items.map((event: EventType) =>
								!isNaN(Number(event.latitude)) && !isNaN(Number(event.longitude)) ? (
									<Marker
										key={event.id}
										position={{ lat: Number(event.latitude), lng: Number(event.longitude) }}
										title={event.title}
										onClick={() => router.push(`/events/${event.id}`)}
									/>
								) : null
							)}
						</GoogleMap>
					</Box>
				) : (
					<CircularProgress />
				)}

				{data?.meta?.totalPages > 1 && view === 'list' && (
					<Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
						<Pagination
							count={data.meta.totalPages}
							page={page}
							onChange={(_, value) => setPage(value)}
							color="primary"
						/>
					</Box>
				)}
			</Box>
		</>
	);
}
