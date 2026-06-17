import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import "./mobile.css";
import DotBackground from "./components/DotBackground";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  icons: { icon: '/favicon.svg' },
  title: "Francis Kyle Lorenzana | Full-Stack Developer",
  description: "BSIT Graduate specializing in full-stack development with React.js, Next.js, Django, and modern web technologies.",
  keywords: ["Full-Stack Developer", "Software Developer", "React.js", "Django", "Python", "Java", "Web Development"],
  authors: [{ name: "Francis Kyle Lorenzana" }],
  openGraph: {
    title: "Francis Kyle Lorenzana | Full-Stack Developer",
    description: "BSIT Graduate specializing in full-stack development",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body className={`${plusJakartaSans.variable} antialiased`}>
        <DotBackground />
        {children}
      </body>
    </html>
  );
}
