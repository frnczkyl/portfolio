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
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
      </head>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <video
          src="/Background2.mp4"
          autoPlay
          loop
          muted
          className="fixed inset-0 w-full h-full object-cover -z-10"
        ></video>
        {children}
      </body>
    </html>
  );
}