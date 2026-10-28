import type { Metadata } from "next";
import "./globals.css";
import { getLang } from "@/lib/i18n";

export const metadata: Metadata = {
  title: "BSO - Brain Story Organization | Mental Health & Peacebuilding in Somalia",
  description:
    "Brain Story Organization (BSO) is a Somali-led NGO dedicated to mental health care, community resilience, and peacebuilding across Somalia.",
  icons: {
    icon: "/brand/footer/fav%20icon.png",
    shortcut: "/brand/footer/fav%20icon.png",
    apple: "/brand/footer/fav%20icon.png",
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLang();

  return (
    <html lang={lang} className="light">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1.0"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Public+Sans:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
        <noscript>
          <style>{".reveal{opacity:1!important;transform:none!important}"}</style>
        </noscript>
      </head>
      <body className="bg-background-light dark:bg-background-dark text-primary dark:text-slate-100 min-h-screen font-display">
        {children}
      </body>
    </html>
  );
}
