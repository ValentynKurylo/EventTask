'use client';

import { useState } from 'react';
import {
	Box,
	TextField,
	Button,
	Typography,
	Paper,
	CircularProgress,
} from '@mui/material';
import { useRegister } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RegisterPage() {
	const [form, setForm] = useState({ email: '', password: '' });
	const registerMutation = useRegister();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await registerMutation.mutateAsync(form);
			router.push('/events');
		} catch (err) {
			console.error('Registration failed:', err);
		}
	};

	return (
		<Box
			sx={{
				display: 'flex',
				justifyContent: 'center',
				alignItems: 'center',
				minHeight: '100vh',
				bgcolor: 'grey.100',
				px: 2,
			}}
		>
			<Paper
				elevation={3}
				sx={{
					p: 4,
					maxWidth: 400,
					width: '100%',
					borderRadius: 2,
				}}
			>
				<Typography variant="h5" gutterBottom textAlign="center">
					Register
				</Typography>

				<form onSubmit={handleSubmit}>
					<TextField
						label="Email"
						type="email"
						value={form.email}
						onChange={(e) => setForm({ ...form, email: e.target.value })}
						fullWidth
						margin="normal"
						required
					/>
					<TextField
						label="Password"
						type="password"
						value={form.password}
						onChange={(e) => setForm({ ...form, password: e.target.value })}
						fullWidth
						margin="normal"
						required
					/>

					<Button
						type="submit"
						variant="contained"
						color="primary"
						fullWidth
						sx={{ mt: 2 }}
						disabled={registerMutation.isLoading}
					>
						{registerMutation.isLoading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							'Register'
						)}
					</Button>
				</form>

				{registerMutation.error && (
					<Typography color="error" variant="body2" sx={{ mt: 2 }}>
						Something went wrong. Please try again.
					</Typography>
				)}

				<Typography
					variant="body2"
					textAlign="center"
					sx={{ mt: 2, color: 'text.secondary' }}
				>
					Already have an account? <a href="/login">Login</a>
				</Typography>
			</Paper>
		</Box>
	);
}
