import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Francis Kyle Lorenzana | Full-Stack Developer",
  description: "4th-year Software Developer student specializing in full-stack development with React.js, Django Python, and modern web technologies.",
  keywords: ["Full-Stack Developer", "Software Developer", "React.js", "Django", "Python", "Java", "Web Development"],
  authors: [{ name: "Francis Kyle Lorenzana" }],
  openGraph: {
    title: "Francis Kyle Lorenzana | Full-Stack Developer",
    description: "4th-year Software Developer student specializing in full-stack development",
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
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}