import type { Metadata } from "next";
import "./globals.css";
import { AuthProvider } from '@/components/AuthProvider'
import { OfflineBanner, NetworkStatusIndicator } from '@/components/NetworkStatusIndicator'

export const metadata: Metadata = {
  title: "My Wedding Site - Eure perfekte Hochzeitswebsite",
  description: "Erstellt in wenigen Minuten eine wunderschöne Website für eure Hochzeit",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="de">
      <body className="antialiased font-sans">
        <AuthProvider>
          <OfflineBanner />
          {children}
          <NetworkStatusIndicator 
            position="bottom-right" 
            showOnlyOffline={true}
            size="sm"
          />
        </AuthProvider>
      </body>
    </html>
  );
}
