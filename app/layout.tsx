import './globals.css';
import { Toaster } from 'react-hot-toast';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Warehouse Display PT Auto2000',
  description: 'Dashboard Inventory Gudang'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <body>
        <Toaster position="top-right" />
        {children}
      </body>
    </html>
  );
}
