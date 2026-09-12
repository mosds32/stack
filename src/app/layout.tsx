import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Phase 5 - Next.js Intermediate',
  description: 'Full-stack practice app for Next.js intermediate features',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
