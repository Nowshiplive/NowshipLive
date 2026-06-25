import './globals.css';

export const metadata = {
  title: 'NowShip Live',
  description: 'NowShip Live CRM',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
