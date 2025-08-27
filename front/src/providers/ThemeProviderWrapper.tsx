'use client';

import { ReactNode } from 'react';
import { CssBaseline, ThemeProvider } from '@mui/material';
import theme from '../theme';

export default function ThemeProviderWrapper({ children }: { children: ReactNode }) {
	return (
		<ThemeProvider theme={theme}>
			<CssBaseline />
			{children}
		</ThemeProvider>
	);
}
