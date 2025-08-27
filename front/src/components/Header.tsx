'use client';

import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {logout} from "@/hooks/useAuth";

export default function Header() {
	const router = useRouter();

	const handleLogout = () => {
		logout()
	};

	return (
		<AppBar position="sticky" color="primary" elevation={2}>
			<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
				<Typography
					variant="h6"
					component={Link}
					href="/events"
					style={{ textDecoration: 'none', color: 'inherit' }}
				>
					Event Manager
				</Typography>

				<Box sx={{ display: 'flex', gap: 2 }}>
					<Button
						variant="contained"
						color="secondary"
						component={Link}
						href="/events/create"
					>
						Create New
					</Button>
					<Button variant="outlined" color="inherit" onClick={handleLogout}>
						Logout
					</Button>
				</Box>
			</Toolbar>
		</AppBar>
	);
}
