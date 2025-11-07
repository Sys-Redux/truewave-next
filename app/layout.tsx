import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { ClientLayout } from "@/components/layout/ClientLayout";

export const metadata: Metadata = {
  title: "TrueWave - Cyber Store",
  description: "Premium e-commerce experience with cutting-edge design",
  icons: {
    icon: '/truewave-icon-larger-circle.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Providers>
          <ClientLayout>
            {children}
          </ClientLayout>
        </Providers>
      </body>
    </html>
  );
}
