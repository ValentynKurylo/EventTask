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
import { useLogin } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
	const [form, setForm] = useState({ email: '', password: '' });
	const loginMutation = useLogin();
	const router = useRouter();

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		try {
			await loginMutation.mutateAsync(form);
			router.push('/events');
		} catch (error) {
			console.error('Login failed:', error);
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
					Login
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
						disabled={loginMutation.isLoading}
					>
						{loginMutation.isLoading ? (
							<CircularProgress size={24} color="inherit" />
						) : (
							'Login'
						)}
					</Button>
				</form>

				{loginMutation.error && (
					<Typography color="error" variant="body2" sx={{ mt: 2 }}>
						Invalid email or password. Please try again.
					</Typography>
				)}

				<Typography
					variant="body2"
					textAlign="center"
					sx={{ mt: 2, color: 'text.secondary' }}
				>
					Don’t have an account? <a href="/register">Register</a>
				</Typography>
			</Paper>
		</Box>
	);
}
