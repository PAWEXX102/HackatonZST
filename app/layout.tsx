import type { Metadata } from "next";
import { Nunito } from "next/font/google";
import { AuthProvider } from "./auth";
import ProviderUI from "./providers/UI";
import Sidebar from "./components/sidebar";
import Topbar from "./components/topbar";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { Toaster } from "sonner";
import DarkBackground from "./components/dark";

export const metadata: Metadata = {
  metadataBase: new URL("https://hackaton-preview.vercel.app/"),
  title: "FoodGenius",
  description: "AI Food Application",
  manifest: "/manifest.json",
  generator: "Next.js",
  icons: [
    { rel: "apple-touch-icon", url: "/logoczarne2.png" },
    { rel: "icon", url: "/logoczarne2.png" },
  ],
};

const NunitoFont = Nunito({
  weight: ["200", "300", "400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="dns-prefetch" href="https://firestore.googleapis.com" />
        <link
          rel="dns-prefetch"
          href="https://identitytoolkit.googleapis.com"
        />
        <link rel="manifest" href="manifest.json" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        ></meta>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        ></meta>
      </head>
      <body
        className={` ${NunitoFont.className} flex w-svw h-svh overflow-hidden overflow-x-hidden `}
      >
        <AuthProvider>
          <ProviderUI>
            <div className=" h-svh w-svw flex">
              <DarkBackground />
              <Sidebar />
              <div className=" relative overflow-hidden h-svh w-svw flex flex-col">
                <Topbar />
                {children}
                <Toaster richColors />
                <SpeedInsights />
                <Analytics />
              </div>
            </div>
          </ProviderUI>
        </AuthProvider>
      </body>
    </html>
  );
}
