import { ReactNode } from 'react';
import ReactQueryProvider from '@/providers/ReactQueryProvider';
import ThemeProviderWrapper from '@/providers/ThemeProviderWrapper';

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
    <head>
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
      <link
        href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap"
        rel="stylesheet"
      />
    </head>
    <body>
    <ReactQueryProvider>
      <ThemeProviderWrapper>
        {children}
      </ThemeProviderWrapper>
    </ReactQueryProvider>
    </body>
    </html>
  );
}
