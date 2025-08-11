import type { Metadata } from "next";
import "./globals.css";
import { Alegreya_Sans, Forum } from "next/font/google";
import Nav from "./components/Nav";
import { getConfig, SiteConfig } from "./getConfig";

export const generateMetadata = async (): Promise<Metadata> => {
  const configData = await getConfig();
  const config: SiteConfig | null = Array.isArray(configData)
    ? null
    : configData;

  if (!config) {
    return {
      title: "Google SpreadSheet Menu integrations",
      description:
        "Test to integrate the a google sheet menu into a nextjs app",
    };
  }

  return {
    title: config.seo?.titulo,
    description: config.seo?.descripcion,
    openGraph: {
      title: config.seo?.titulo ?? "",
      description: config.seo?.descripcion ?? "",
      url: config.seo.dominio ?? "",
      siteName: config.seo.nombreDelSitio ?? "",
      images: config.seo.imagen
        ? [
            {
              url: config.seo.imagen,
              width: 1920,
              height: 1080,
              alt: config.seo.titulo ?? "",
            },
          ]
        : undefined,
      locale: config.seo.locale ?? "en_US",
      type: "website",
    },
  };
};

const forum = Forum({
  weight: "400",
  variable: "--font-forum",
});
const alegreya = Alegreya_Sans({
  weight: "400",
  variable: "--font-alegreya",
  // subsets: ["latin"],
});
export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const configData = await getConfig();
  const config: SiteConfig | null = Array.isArray(configData)
    ? null
    : configData;

  if (!config) {
    return;
  }

  return (
    <html lang="en">
      <body
        className={`antialiased ${alegreya.variable} ${forum.variable}`}
        style={
          {
            ["--background"]: config.visuales.colorPrimario ?? "black",
            ["--foreground"]: config.visuales.colorSecundario ?? "red",
          } as React.CSSProperties
        }
      >
        <Nav />
        {children}
        <footer className="px-5 pb-5">
          <div className="w-full border border-foreground/70 text-foreground/70 flex items-center justify-center py-2 rounded-lg">
            <span>{config.visuales.copywright}</span>
          </div>
        </footer>
      </body>
    </html>
  );
}
