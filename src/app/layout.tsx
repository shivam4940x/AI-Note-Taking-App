import { Toaster } from "sonner";
import { Metadata } from "next";
import "@/css/global.css";

export const metadata: Metadata = {
  title: "Mern/Pern-Stack Developer POC Task",
  description:
    "A simple note-taking application with AI-powered features to demonstrate full-stack development skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body>
        <Toaster richColors />
        {children}
        <script
          dangerouslySetInnerHTML={{
            __html: `
        const t = localStorage.getItem('theme');
        if (t === 'dark') document.documentElement.classList.add('dark');
      `,
          }}
        />
      </body>
    </html>
  );
}
