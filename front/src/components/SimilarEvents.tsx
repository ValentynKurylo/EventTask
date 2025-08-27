"use client";

import { useEffect, useState } from "react";
import {
	Box,
	Typography,
	Select,
	MenuItem,
	Card,
	CardContent,
	CircularProgress,
} from "@mui/material";
import Link from "next/link";
import { useSimilarEvents } from "@/hooks/useEvents";
import { EventType } from "@/types/event.type";
import { SimilarTypeEnum } from "@/common/enums/similar.type.enum";

import { Swiper, SwiperSlide } from "swiper/react";
import { Mousewheel } from "swiper/modules";
import "swiper/css";
import "swiper/css/mousewheel";

export default function SimilarEvents({ eventId }: { eventId: number }) {
	const [by, setBy] = useState<SimilarTypeEnum>(SimilarTypeEnum.CATEGORY);
	const [page, setPage] = useState(1);
	const [events, setEvents] = useState<EventType[]>([]);

	const { data, isLoading } = useSimilarEvents(eventId, by, page);

	useEffect(() => {
		if (data?.items) {
			if (page === 1) {
				setEvents(data.items);
			} else {
				setEvents((prev) => [...prev, ...data.items]);
			}
		}
	}, [data, page]);

	return (
		<Box
			sx={{
				mt: 6,
				py: 6,
				background: "linear-gradient(135deg, #f5f7fa 0%, #e4ebf0 100%)",
			}}
		>
			<Box sx={{ maxWidth: 900, mx: "auto" }}>
				{/* Header */}
				<Box
					sx={{
						display: "flex",
						justifyContent: "space-between",
						alignItems: "center",
						mb: 3,
					}}
				>
					<Typography variant="h4" fontWeight="bold">
						Similar Events
					</Typography>

					<Select
						value={by}
						size="small"
						onChange={(e) => {
							setPage(1);
							setBy(e.target.value as SimilarTypeEnum);
						}}
					>
						<MenuItem value={SimilarTypeEnum.CATEGORY}>By Category</MenuItem>
						<MenuItem value={SimilarTypeEnum.LOCATION}>By Location</MenuItem>
						<MenuItem value={SimilarTypeEnum.DATE}>By Date</MenuItem>
					</Select>
				</Box>

				{isLoading && page === 1 ? (
					<Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
						<CircularProgress />
					</Box>
				) : !events.length ? (
					<Typography textAlign="center">No similar events found.</Typography>
				) : (
					<Swiper
						direction="vertical"
						slidesPerView={2}
						spaceBetween={20}
						mousewheel
						modules={[Mousewheel]}
						breakpoints={{
							640: { slidesPerView: 2 },
							1024: { slidesPerView: 3 },
						}}
						onReachEnd={() => {
							if (page < (data?.meta?.totalPages || 1)) {
								setPage((p) => p + 1);
							}
						}}
						style={{ height: "600px" }}
					>
						{events.map((event: EventType) => (
							<SwiperSlide key={event.id}>
								<Card
									sx={{
										borderRadius: 3,
										boxShadow: 3,
										transition: "0.3s",
										height: "100%",
										display: "flex",
										flexDirection: "column",
										"&:hover": {
											boxShadow: 6,
											transform: "translateY(-5px)",
										},
									}}
								>
									{event.imageUrl && (
										<Box
											component="img"
											src={event.imageUrl}
											alt={event.title}
											sx={{
												width: "100%",
												height: 160,
												objectFit: "cover",
												borderTopLeftRadius: 12,
												borderTopRightRadius: 12,
											}}
										/>
									)}
									<CardContent sx={{ flexGrow: 1 }}>
										<Typography variant="h6" gutterBottom>
											{event.title}
										</Typography>
										<Typography variant="body2" color="text.secondary">
											{new Date(event.date).toLocaleDateString()}
										</Typography>
										<Typography
											variant="body2"
											color="text.secondary"
											gutterBottom
										>
											{event.location}
										</Typography>
										<Link
											href={`/events/${event.id}`}
											style={{ color: "#1976d2", fontWeight: 500 }}
										>
											View Details →
										</Link>
									</CardContent>
								</Card>
							</SwiperSlide>
						))}
					</Swiper>
				)}
			</Box>

			{isLoading && page > 1 && (
				<Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
					<CircularProgress size={30} />
				</Box>
			)}
		</Box>
	);
}
