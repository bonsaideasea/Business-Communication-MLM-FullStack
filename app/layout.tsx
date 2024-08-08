import type { Metadata } from "next";
import { Inter, Roboto } from "next/font/google";
import "./globals.css";
import AuthProvider from "./(auth)/auth/Provider";


//https://nextjs.org/docs/pages/building-your-application/optimizing/fonts

const inter = Inter({ subsets: ["latin"] });
const roboto = Roboto({
  weight: ["100", "300", "400", "700"],
  subsets: ["latin"],
  variable: "--font-roboto",
});

export const metadata: Metadata = {
  title: "Communication App",
  description: "Made by MLM Team",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/svg+xlm" href="/icon.svg"/>
      </head>
      <body className={roboto.variable}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
