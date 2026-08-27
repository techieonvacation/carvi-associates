import type { Metadata, Viewport } from "next";
import { DM_Sans, Sora, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./findox.css";
import { cn } from "@/lib/utils";
import { SeoScripts } from "@/components/seo/seo-scripts";
import { buildMetadata } from "@/lib/seo/metadata";
import { getSeoSettings } from "@/lib/seo/queries";
import { getRequestPathname } from "@/lib/seo/request";

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const sora = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
  display: "swap",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const pathname = await getRequestPathname("/");
  return buildMetadata({ path: pathname });
}

export async function generateViewport(): Promise<Viewport> {
  const settings = await getSeoSettings();
  return {
    width: "device-width",
    initialScale: 1,
    themeColor: [
      { media: "(prefers-color-scheme: light)", color: settings.themeColorLight },
      { media: "(prefers-color-scheme: dark)", color: settings.themeColorDark },
    ],
    colorScheme: settings.colorScheme as Viewport["colorScheme"],
  };
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [settings, pathname] = await Promise.all([getSeoSettings(), getRequestPathname("/")]);

  return (
    <html
      lang={settings.siteLanguage || "en"}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={cn(
        "h-full",
        "antialiased",
        dmSans.variable,
        sora.variable,
        geistMono.variable,
        "font-sans",
      )}
    >
      <head>
        <SeoScripts placement="HEAD" pathname={pathname} />
      </head>
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        <SeoScripts placement="BODY_START" pathname={pathname} />
        {children}
        <SeoScripts placement="BODY_END" pathname={pathname} />
      </body>
    </html>
  );
}
