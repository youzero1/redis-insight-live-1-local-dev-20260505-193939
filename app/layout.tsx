import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Redis Insight - Live Traffic',
  description: 'Real-time Redis traffic monitoring dashboard',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
