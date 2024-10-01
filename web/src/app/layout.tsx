import type { Metadata } from "next";
import "./globals.css";
import { PlaygroundStateProvider } from "@/hooks/use-playground-state";
import { ConnectionProvider } from "@/hooks/use-connection";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Public_Sans } from "next/font/google";

// Configure the Public Sans font
const publicSans = Public_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  display: "swap",
});

import "@livekit/components-styles";

export const metadata: Metadata = {
  title: "Realtime Playground",
  description:
    "Try OpenAI's new Realtime API right from your browser. Built on LiveKit Agents.",
  openGraph: {
    title: "Realtime Playground",
    description:
      "Try OpenAI's new Realtime API right from your browser. Built on LiveKit Agents.",
    type: "website",
    url: "https://playground.livekit.io/",
    images: [
      {
        url: "https://playground.livekit.io/og-image.png",
        width: 1200,
        height: 675,
        type: "image/png",
        alt: "Realtime Playground",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={publicSans.className}>
        <PlaygroundStateProvider>
          <ConnectionProvider>
            <TooltipProvider>
              {children}
              <Toaster />
            </TooltipProvider>
          </ConnectionProvider>
        </PlaygroundStateProvider>
      </body>
    </html>
  );
}
