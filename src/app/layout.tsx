import type { Metadata, Viewport } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/ThemeProvider";
import { SchoolProvider } from "@/components/SchoolProvider";
import { AppShell } from "@/components/AppShell";
import { PWARegister } from "@/components/PWARegister";

export const metadata: Metadata = {
  title: "EduSocial AI Manager",
  description:
    "AI social media manager for Sri Narayana High School (Ghanpur) & Sri Adarshavani High School (Duggondi).",
  manifest: "/manifest.json",
  appleWebApp: { capable: true, title: "EduSocial", statusBarStyle: "black-translucent" },
};

export const viewport: Viewport = {
  themeColor: "#3563ff",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <SchoolProvider>
            <AppShell>{children}</AppShell>
            <PWARegister />
          </SchoolProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
