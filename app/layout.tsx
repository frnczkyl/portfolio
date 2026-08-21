import type { Metadata } from "next";
import "./globals.css";
import "./mobile.css";

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
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" type='text/css' href="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/devicon.min.css" />
        <link rel="stylesheet" href="https://api.fontshare.com/v2/css?f[]=general-sans@400,500,600,700,800&display=swap" />
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem('theme');if(!t){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`,
          }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
